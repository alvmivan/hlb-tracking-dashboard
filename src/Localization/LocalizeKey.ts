import {getLocalizedString} from "../lib/hlb-api-library/src/localization/domain/localizationService";

const localizationCache: Map<string, string> = new Map();


type LocalizationTable = {
    language?: string,
    entries: { key: string, value: string }[ ]
};

export const localizeKey = (key: string) => {

    let localizationTable: LocalizationTable = {entries: [{key: "", value: ""}]};
    if (localizationCache.size === 0) {
        localizationTable = getLocalizedString();
        const entries = localizationTable.entries;
        entries.forEach((entry) => localizationCache.set(entry.key, entry.value));
    }

    if (localizationCache.has(key)) return localizationCache.get(key);

    console.warn(key + " not found in localization table ", localizationTable);
    return "<< " + key + " >>";

}