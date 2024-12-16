import {AppConfig} from "../../shared/appContext";
import {handleError, sendGet, sendPost} from "../../shared/connectionUtils";


export type CompanyData = { companyId: number, clientName: string, address: string }


export async function isIdAvailable(companyId: number): Promise<boolean> {
    const ApiUrl = AppConfig.get("API_URL");
    const CompaniesAPiUrl = `${ApiUrl}/companies`;
    const response = await sendGet(`${CompaniesAPiUrl}/isIdAvailable/${companyId}`);
    const {available} = await response.json();
    return available;
}

export async function isNameAvailable(companyName: string): Promise<boolean> {
    const ApiUrl = AppConfig.get("API_URL");
    const CompaniesAPiUrl = `${ApiUrl}/companies`;

    const response = await sendGet(`${CompaniesAPiUrl}/isNameAvailable/${companyName}`);
    await handleError(response);
    const {available} = await response.json();
    return available;
}

export async function findCompany(companyId: number): Promise<CompanyData | null> {
    const ApiUrl = AppConfig.get("API_URL");
    const CompaniesAPiUrl = `${ApiUrl}/companies`;
    const response = await sendGet(`${CompaniesAPiUrl}/findCompany/${companyId}`);
    if (response.status === 404) {
        return null;
    }
    await handleError(response);
    return await response.json();
}

export async function getAllCompanies(): Promise<CompanyData[]> {
    const ApiUrl = AppConfig.get("API_URL");
    const CompaniesAPiUrl = `${ApiUrl}/companies`;

    const response = await sendGet(`${CompaniesAPiUrl}/getAllCompanies`);
    const data = await response.json();
    return data["companies"];
}

export async function registerCompany(companyData: CompanyData) {


    const companyId = companyData.companyId;
    const isIdAvailableResponse = await isIdAvailable(companyId);
    if (!isIdAvailableResponse) {
        console.error(`Company with id ${companyId} already exists`);
        throw new Error(`Company with id ${companyId} already exists`);
    }

    const ApiUrl = AppConfig.get("API_URL");
    const CompaniesAPiUrl = `${ApiUrl}/companies`;

    const response = await sendPost(`${CompaniesAPiUrl}/register`, companyData);
    await handleError(response);
    return await response.json();
}


