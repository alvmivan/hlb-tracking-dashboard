import {sendGet} from "../../shared/connectionUtils";
import {AppCache, AppConfig, MemoryCache} from "../../shared/appContext";

export type LocalizationEntry = {
    key: string;
    value: string;
}

export type LocalizationTable = {
    language: string;
    entries: LocalizationEntry[];
}

export async function initializeLocalization(): Promise<LocalizationTable> {

    console.log("Downloading localization files");

    const API_URL = AppConfig.get("API_URL");
    const localizationUrl = API_URL + '/localization';
    const response = await sendGet(localizationUrl);
    const table: LocalizationTable = await response.json();
    MemoryCache.set(table.language, table.entries);
    return table;
}

export function getLocalizationTable(lang: string = "es"): LocalizationTable {

    if (!MemoryCache.has(lang)) {
        console.error("Download localization first! , you need to call\n await initializeLocalization();\nbeforehand");
        return {language: lang, entries: []}
    }

    return {
        language: lang,
        entries: MemoryCache.get(lang)
    };

}
    