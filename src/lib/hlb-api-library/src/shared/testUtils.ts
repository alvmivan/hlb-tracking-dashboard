import {AppConfig, configSettings} from "./appContext";


export const eraseBackend = async () => {
    prepareConfig();
    const API_URL = AppConfig.get("API_URL");
    const CLEAN_DB_URL = `${API_URL}/delete-all`;
    const response = await fetch(CLEAN_DB_URL,
        {
            method: 'DELETE'
        });

    if (!response.ok) {
        const errorMessage = await response.text();
        console.error(response.status);
        console.error(errorMessage);
    }
}

export const prepareConfig = () => {
    configSettings(
        {
            IsDebug: true,
            config:
                {
                    API_URL: "http://localhost:3000/api"
                }
        }
    );
}