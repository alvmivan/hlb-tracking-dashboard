import {
    findCompany,
    getAllCompanies,
    isIdAvailable,
    isNameAvailable,
    registerCompany
} from "../domain/companiesService";
import {eraseBackend, prepareConfig} from "../../shared/testUtils";


let company001 = {
    clientName: "Test Company 001",
    address: "Test Address",
    companyId: 1,
};

let company002 = {
    clientName: "Test Company 002",
    address: "Test Address",
    companyId: 2,
}

export const registerClientFlow = async () => {

    prepareConfig();
    await eraseBackend();
    
    await registerCompany(company001);
    console.log("Company 001 registered");
    await registerCompany(company002);
    console.log("Company 002 registered");
    
    let company = await findCompany(0);
    console.log("Company 0: ", company);
    
    // is available id for 0 1 2
    let available = await isIdAvailable(0);
    console.log("Id 0 available: ", available);
    available = await isIdAvailable(1);
    console.log("Id 1 available: ", available);
    available = await isIdAvailable(2);
    console.log("Id 2 available: ", available);
    
    // is available name for Test Company 001 002
    available = await isNameAvailable("Test Company 001");
    console.log("Name Test Company 001 available: ", available);
    
    available = await isNameAvailable("Test Company 002");
    console.log("Name Test Company 002 available: ", available);
    
    available = await isNameAvailable("Test Company 003");
    console.log("Name Test Company 003 available: ", available);
    
    // get all
    let companies = await getAllCompanies();
    
    console.log("All companies: ", companies);
    
    
    
    
    
    


}