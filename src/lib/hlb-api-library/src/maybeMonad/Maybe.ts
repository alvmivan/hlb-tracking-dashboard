/**
 * Represents a value that may or may not be present.
 * @template T The type of the value.
 */
export type Maybe<T> = Just<T> | Nothing;


/**
 * Represents a value that is present.
 * @template T The type of the value.
 */
export class Just<T> {
    private readonly value: T;

    /**
     * Creates an instance of Just.
     * @param {T} value The value to wrap.
     */
    constructor(value: T) {
        this.value = value;
    }

    /**
     * Checks if the instance is Just.
     * @returns {boolean} True if the instance is Just.
     */
    isJust(): boolean {
        return true;
    }

    /**
     * Checks if the instance is Nothing.
     * @returns {boolean} False if the instance is Just.
     */
    isNothing(): boolean {
        return false;
    }

    /**
     * Gets the value.
     * @returns {T} The wrapped value.
     */
    getValue(): T {
        return this.value;
    }

    /**
     * Maps the value to a new Maybe instance.
     * @template U The type of the new value.
     * @param {(value: T) => U} fn The function to apply to the value.
     * @returns {Maybe<U>} A new Maybe instance with the mapped value.
     */
    map<U>(fn: (value: T) => U): Maybe<U> {
        return new Just(fn(this.value));
    }

    /**
     * Flat maps the value to a new Maybe instance.
     * @template U The type of the new value.
     * @param {(value: T) => Maybe<U>} fn The function to apply to the value.
     * @returns {Maybe<U>} A new Maybe instance.
     */
    flatMap<U>(fn: (value: T) => Maybe<U>): Maybe<U> {
        return fn(this.value);
    }

    /**
     * Filters the value based on a predicate.
     * @param {(value: T) => boolean} predicate The predicate to apply to the value.
     * @returns {Maybe<T>} The current instance if the predicate is true, otherwise Nothing.
     */
    filter(predicate: (value: T) => boolean): Maybe<T> {
        return predicate(this.value) ? this : new Nothing();
    }

    /**
     * Gets the value or a default value.
     * @template U The type of the default value.
     * @param {U} defaultValue The default value to return if the instance is Nothing.
     * @returns {T} The wrapped value.
     */
    orElse<U>(defaultValue: U): T {
        return this.value;
    }

    /**
     * return a maybe by passing another maybe as a parameter, if the first one is nothing, then
     * return the second one
     * @param {Maybe<T>} maybe The maybe to return if the current one is Nothing.
     */
    orElseMaybe(maybe: Maybe<T>): Maybe<T> {
        return this;
    }



    /**
     * Performs an action with the value.
     * @param {(value: T) => void} action The action to perform.
     * @returns {this} The current instance.
     */
    do(action: (value: T) => void): this {
        action(this.value);
        return this;
    }


    /**
     * Performs an asynchronous action with the value.
     * @param {(value: T) => Promise<void>} action The asynchronous action to perform.
     * @returns {Promise<this>} A promise that resolves to the current instance.
     */
    doAsync(action: (value: T) => Promise<any>): this {
        action(this.value).then();
        return this;
    }


    /**
     * Does nothing if the instance is Nothing.
     * @param {() => void} _ The action to perform.
     * @returns {this} The current instance.
     */
    doOnAbsent(_: () => void): this {
        return this;
    }

    /**
     * Does nothing if the instance is Nothing.
     * @param {() => void} _ The action to perform.
     * @returns {this} The current instance.
     */
    else(_: () => void): this {
        return this;
    }
}

/**
 * Represents a value that is absent.
 */
export class Nothing {
    /**
     * Checks if the instance is Just.
     * @returns {boolean} False if the instance is Nothing.
     */
    isJust(): boolean {
        return false;
    }

    /**
     * return a maybe by passing another maybe as a parameter, if the first one is nothing, then
     * return the second one
     * @param {Maybe<T>} maybe The maybe to return if the current one is Nothing.
     */
    orElseMaybe<T>(maybe: Maybe<T>): Maybe<T> {
        return maybe;
    }

    /**
     * Checks if the instance is Nothing.
     * @returns {boolean} True if the instance is Nothing.
     */
    isNothing(): boolean {
        return true;
    }

    /**
     * Throws an error because there is no value.
     * @throws {Error} Always throws an error.
     */
    getValue(): never {
        throw new Error("Cannot get value of Nothing");
    }

    /**
     * Maps the value to a new Maybe instance.
     * @template U The type of the new value.
     * @param {(value: any) => U} _ The function to apply to the value.
     * @returns {Maybe<U>} A new Nothing instance.
     */
    map<U>(_: (value: any) => U): Maybe<U> {
        return new Nothing();
    }

    /**
     * Flat maps the value to a new Maybe instance.
     * @template U The type of the new value.
     * @param {(value: any) => Maybe<U>} _ The function to apply to the value.
     * @returns {Maybe<U>} A new Nothing instance.
     */
    flatMap<U>(_: (value: any) => Maybe<U>): Maybe<U> {
        return new Nothing();
    }

    /**
     * Filters the value based on a predicate.
     * @param {(value: any) => boolean} _ The predicate to apply to the value.
     * @returns {Maybe<any>} The current instance.
     */
    filter(_: (value: any) => boolean): Maybe<any> {
        return this;
    }

    /**
     * Gets the default value.
     * @template U The type of the default value.
     * @param {U} defaultValue The default value to return.
     * @returns {U} The default value.
     */
    orElse<U>(defaultValue: U): U {
        return defaultValue;
    }

    /**
     * Does nothing because there is no value.
     * @param {(value: any) => void} _ The action to perform.
     * @returns {this} The current instance.
     */
    do(_: (value: any) => void): this {
        return this;
    }

    /**
     * Does nothing because there is no value.
     */
    doAsync(_: (value: any) => Promise<void>): this {
        return this;
    }

    /**
     * Performs an action if the instance is Nothing.
     * @param {() => void} action The action to perform.
     * @returns {this} The current instance.
     */
    doOnAbsent(action: () => void): this {
        action();
        return this;
    }

    /**
     * Performs an action if the instance is Nothing.
     * @param {() => void} action The action to perform.
     * @returns {this} The current instance.
     */
    else(action: () => void): this {
        action();
        return this;
    }
}

/**
 * Helper function to create Maybe instances.
 * @template T The type of the value.
 * @param {T | null | undefined} value The value to wrap.
 * @returns {Maybe<T>} A Maybe instance wrapping the value.
 */
export const maybeOf = <T>(value: T | null | undefined): Maybe<T> =>
    value == null ? new Nothing() : new Just(value);

export function nothing<T>(): Maybe<T> {
    return new Nothing();
}

export function just<T>(value: T): Maybe<T> {
    return new Just(value);
}