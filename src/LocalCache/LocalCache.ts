import {AppCache} from "hlb-api-library/src/shared/appContext";
import {just, Maybe, nothing} from "hlb-api-library/src/maybeMonad/Maybe";


type SerializedDict<TKey, TValue> = {
    entries: { key: TKey, value: TValue }[]
}

export class LocalCache<TKey, TValue> {
    private readonly structureKey: string;
    private readonly memoryCache: Map<TKey, TValue> = new Map<TKey, TValue>();

    public static async findOrCreate<TKey, TValue>(key: string): Promise<LocalCache<TKey, TValue>> {

        const currentCache = await AppCache.get(key);
        if (currentCache !== null) {
            return new LocalCache<TKey, TValue>(key, currentCache);
        }

        return new LocalCache<TKey, TValue>(key);
    }

    private constructor(structureKey: string, serializedCache?: SerializedDict<TKey, TValue>) {
        this.structureKey = structureKey;
        if (serializedCache !== undefined) {
            if (serializedCache?.entries) {
                serializedCache.entries.forEach(entry => this.memoryCache.set(entry.key, entry.value));
            }
        }
    }

    public get(key: TKey): Maybe<TValue> {
        if (this.memoryCache.has(key)) {
            const value: TValue | undefined = this.memoryCache.get(key);
            if (value !== undefined)
                return just(value);
            return nothing();
        }
        return nothing();
    }

    public async set(key: TKey, value: TValue): Promise<void> {
        this.memoryCache.set(key, value);
        await this.save();
    }

    public async remove(key: TKey): Promise<void> {
        this.memoryCache.delete(key);
        await this.save();
    }


    public has(key: TKey): boolean {
        return this.memoryCache.has(key);
    }

    private async save(): Promise<void> {
        const serializedCache: SerializedDict<TKey, TValue> = {
            entries: Array.from(this.memoryCache.entries(), ([key, value]) => ({key, value}))
        };
        await AppCache.set(this.structureKey, serializedCache);
    }


}