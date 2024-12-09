import {Maybe} from "hlb-api-library/src/maybeMonad/Maybe";
import {LocalCache} from "../LocalCache/LocalCache.ts";
import {CompanyData, findCompany, getAllCompanies} from "hlb-api-library/src/companies/domain/companiesService.ts";
import {maybeOf} from "hlb-api-library/src/maybeMonad/Maybe.ts";
import {InitializationStep} from "../Initialization/initializationSteps.ts";

let cache: LocalCache<number, CompanyData>;

export const initCompaniesCacheStep: InitializationStep = {
    name: "Initialize Companies Cache",
    action: async () => {
        cache = await LocalCache.findOrCreate<number, CompanyData>("companyData")
        getAllCompanies().then(companies => companies.forEach(company => cacheCompanyData(company)));
    }
}

async function cacheCompanyData(companyData: CompanyData): Promise<void> {
    await cache.set(companyData.companyId, companyData);
}

export const fetchCompanyData = async (companyId: number): Promise<Maybe<CompanyData>> => {
    let company: Maybe<CompanyData> = cache.get(companyId);

    if (company.isNothing()) {
        company = maybeOf(await findCompany(companyId))
            .doAsync(data => cacheCompanyData(data))
            .do(data => console.log("Company data to cache: ", data));
    }

    return company
}