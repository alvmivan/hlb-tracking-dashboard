import {
    createDeliveryNote,
    DeliveryNoteData,
    DeliveryNoteOperationData, DeliveryNotesFilterData,
    getDeliveryNotes
} from "../domain/deliveryNotesService";

import {testAuth} from "../../auth/debug/loginUtil";
import {registerCompany} from "../../companies/domain/companiesService";
import {eraseBackend, prepareConfig} from "../../shared/testUtils";
import {
    createDumpster,
    CreateDumpsterData,
    DumpsterData,
    getDumpsterByCode
} from "../../dumpsters/domain/dumpstersServices";


const amountOfClients = 5;
const amountOfDumpsters = 10;
const amountOfOperationsPerDeliveryNote = 3;
const amountOfDeliveryNotes = 6; //per client


function getLocation(seed: number): { latitude: number, longitude: number } {
    let center = {latitude: -38.7150600467283, longitude: -62.25485200946408};
    let radius = 0.05;
    //let's create a random number with the seed to make the angle
    let angle = seed * 137.5;
    let latitude = center.latitude + radius * Math.sin(angle);
    let longitude = center.longitude + radius * Math.cos(angle);
    return {latitude, longitude};
}


async function newDumpster(dumpsterData: CreateDumpsterData): Promise<DumpsterData> {
    await createDumpster(dumpsterData);
    return (await getDumpsterByCode(dumpsterData.dumpsterCode))!;
}

async function createDumpsters(): Promise<DumpsterData[]> {
    const types = ["chico", "mediano", "grande"];
    let dumpsters: DumpsterData[] = [];
    for (let i = 0; i < amountOfDumpsters; i++) {
        let type = types[i % types.length];
        let code = (i + 1).toString();
        let data = {type, dumpsterCode: code};
        dumpsters.push(await newDumpster(data));
    }
    return dumpsters;
}

async function createClients(): Promise<{ companyId: number }[]> {
    let companies = []
    for (let i = 0; i < amountOfClients; i++) {
        let companyId = i + 12;
        let randomSeeded = (companyId * 137) ^ 31245121;
        let clientName = `Cliente ${companyId}`;
        let address = `Calle ${companyId} ${randomSeeded % 800}`;
        await registerCompany({companyId, clientName, address});
        companies.push({companyId});
    }
    return companies;
}


async function createOperations(dumpsters: DumpsterData[]): Promise<DeliveryNoteOperationData[]> {

    let operations: DeliveryNoteOperationData[] = [];
    for (let i = 0; i < amountOfOperationsPerDeliveryNote; i++) {
        let dumpsterId = dumpsters[i % dumpsters.length].dumpsterId;
        let gpsLocation = getLocation(dumpsterId);
        let operationTypeId = i % 12 + 1;
        operations.push({dumpsterId, operationTypeId, gpsLocation});
    }
    return operations;
}

async function createDeliveryNotes(companies: { companyId: number }[], dumpsters: DumpsterData[]) {

    //iterate companies
    for (let company of companies) {
        for (let i = 0; i < amountOfDeliveryNotes; i++) {
            let deliveryNoteData: DeliveryNoteData = {
                isCourtesy: false,
                companyId: company.companyId,
                date: new Date(),
                observations: `Observaciones de la entrega ${i} para la empresa ${company.companyId}`,
                operations: await createOperations(dumpsters)
            }
            await createDeliveryNote(deliveryNoteData);
        }
    }
}


export async function createSomeDeliveryNotes() {
    prepareConfig();
    console.log("Initializing...");
    await eraseBackend();
    await testAuth();
    console.log("initial setup done");
    const companies: { companyId: number }[] = await createClients();
    console.log("Clients created");
    const dumpsters: DumpsterData[] = await createDumpsters();
    console.log("Dumpsters created");
    await createDeliveryNotes(companies, dumpsters);
    console.log("Delivery notes created");

    // vamos a obtener algunas delivery notes ahora e imprimir sus datos
    const filter: DeliveryNotesFilterData =
        {
            byCompanyId: [companies[0].companyId],
            byApproval: undefined,
            byOperatorId: undefined,
            dateRange: undefined
        };

    const deliveryNotes = await getDeliveryNotes(filter)


    console.log("-----------Printing some delivery notes----------------");

    for (let deliveryNote of deliveryNotes) {
        console.log("Delivery note for company: ", deliveryNote.companyId);
        console.log("Date: ", deliveryNote.date);
        console.log("Observations: ", deliveryNote.observations);
        console.log("Operations: ");
        for (let operation of deliveryNote.operations) {
            console.log("Dumpster: ", operation.dumpsterId);
            console.log("Operation type: ", operation.operationTypeId);
            console.log("GPS location: ", operation.gpsLocation);
        }
        console.log("-------------------------------------------------");
    }


    console.log("-----------All done----------------");


}