import {initializeLocalization} from "../lib/hlb-api-library/src/localization/domain/localizationService";
import {initStorageStep} from "./setupStorage.ts";
import {initUsersCacheStep} from "../Users/UsersData.ts";
import {initCompaniesCacheStep} from "../Companies/Companies.ts";

export type InitializationStep = {
    name: string,
    description?: string,
    action: () => Promise<void>
}

const initLocalizationStep: InitializationStep = {
    name: "Download Localization",
    description: "Download localization files from the server",
    action: async () => {
        await initializeLocalization();
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
};

const withoutAuthenticationSteps: InitializationStep[] = [
    initStorageStep,
    initUsersCacheStep,
    initLocalizationStep,
]


const authenticatedSteps: InitializationStep[] = [
    {
        name: "Download User Data",
        description: "Download user data from the server",
        action: async () => {
            // Download user data
        }
    },
    {
        name: "Download Operation Types",
        description: "Download operation types from the server",
        action: async () => {
            // Download operation types
            // wait 10 seconds
            return new Promise(resolve => setTimeout(resolve, 1000));
        }
    },
    initCompaniesCacheStep,
]

export const runInitialization = async (isAuthenticated: boolean): Promise<boolean> => {

    const steps: InitializationStep[] = isAuthenticated ? authenticatedSteps : withoutAuthenticationSteps;
    try {
        for (const step of steps) {
            console.log(`Starting step: ${step.name}`);
            if (step.description) {
                console.log(`Description: ${step.description}`);
            }
            await step.action();
            console.log(`Step ${step.name} finished`);
        }

        console.log("Initialization finished");
        return true;
    } catch (e) {
        console.error("Initialization failed", e);
        return false;
    }
}