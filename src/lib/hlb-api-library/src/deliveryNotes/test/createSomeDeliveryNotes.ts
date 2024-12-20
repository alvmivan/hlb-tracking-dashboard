import {
    createDeliveryNote,
    DeliveryNoteData, DeliveryNoteDataToSend,
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
const amountOfDumpsters = 40;
const amountOfOperationsPerDeliveryNote = 3;
const amountOfDeliveryNotes = 25;


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

    const clientNameTest = [
        "NeoTech Innovations",
        "Pangea Solutions",
        "Futura Dynamics",
        "Quantum Edge Labs",
        "Velvet Horizons Inc.",
        "Lunar Echo LLC",
        "Pixel Forge Studios",
        "Apex Ventures",
        "Nimbus Works",
        "Crystal Core Systems",
        "Stellar Nexus Co.",
        "Prisma Engineering",
        "Urban Leaf Farms",
        "Radial Flux Industries",
        "Blazing Trails Logistics",
        "Emerald Hive Design",
        "NimbusCraft LLC",
        "Orion Tide Enterprises",
        "Ironclad Dynamics",
        "Vortex Synergy Group",
        "Zephyr Grid Co.",
        "Horizon Bloom Ventures",
        "Ignite Path Studios",
        "Atlas Node Technologies",
        "Eclipse Aura Inc."
    ];
    
    const testCiudades = [
        "Bahia Blanca",
        "Monte Hermoso",
        "Villa Mitre",
        "General Cerri",
        "Punta Alta",
        "Cabildo",
        "Villa Rosas",
        "Villa Bordeu",
        "Tres Arroyos",
        "Villa Delfina",
        "Villa Harding Green",
    ]

    const testCalles = [
        "Belgrano",
        "Moreno",
        "Rivadavia",
        "Saavedra",
        "Alvear",
        "Mitre",
        "San Martin",
        "Urquiza",
        "Castelli",
        "Viamonte",
        "Las Heras",
        "Guemes",
        "Pueyrredon",
        "Lavalle",
        "Sarmiento",
        "Brown",
        "Pellegrini",
        "Colon",
        "San Lorenzo",
    ]

    let companies = []
    for (let i = 0; i < amountOfClients; i++) {
        let companyId = i + 12;
        let randomSeeded = (companyId * 137) ^ 31245121;
        let clientName = clientNameTest[i % clientNameTest.length] + ` (${companyId})`;
        let address = `${testCalles[i % testCalles.length]} ${randomSeeded % 800}, ${testCiudades[i % testCiudades.length]}`;
        await registerCompany({companyId, clientName, address});
        companies.push({companyId});
    }
    return companies;
}


async function createOperations(dumpsters: DumpsterData[]): Promise<DeliveryNoteOperationData[]> {

    let operations: DeliveryNoteOperationData[] = [];
    //current amount random from 1 to amountOfOperationsPerDeliveryNote

    let currentAmount = Math.floor(Math.random() * amountOfOperationsPerDeliveryNote) + 1;

    function getRandomStatusChange(operationTypeId: number) {
        const noChange = undefined;
        const options: (string | undefined)[] = [
           noChange, noChange, noChange, noChange, noChange, noChange, noChange, noChange, noChange, noChange, noChange, noChange, noChange, noChange, noChange, noChange,
            "GOOD",
            "BURNED", "BURNED", "BURNED", "BURNED",
            "NEED_REPAIR", "NEED_REPAIR", "NEED_REPAIR", "NEED_REPAIR", "NEED_REPAIR", "NEED_REPAIR",
        ]
        // use operationTypeId as a seed to create a random  in range of the options array
        const randomIndex = ((10000019 ^ operationTypeId) * 13713429807 ) % options.length;
        return options[randomIndex];
    }

    for (let i = 0; i < currentAmount; i++) {
        let dumpsterId = dumpsters[i % dumpsters.length].dumpsterId;
        let gpsLocation = getLocation(dumpsterId);
        let operationTypeId = i % 12 + 1;
        operations.push(
            {
                dumpsterId,
                operationTypeId,
                gpsLocation,
                dumpsterPhysicalStatusChange: getRandomStatusChange(operationTypeId ^ dumpsters.length)
            });
    }
    return operations;
}


//Generates a random date within the last 30 days. 
function getRandomDate(): Date {
    const maxDays = 30;
    const randomDays = Math.floor(1 + Math.random() * (maxDays - 1));
    let daysAmount = randomDays * 24 * 60 * 60 * 1000;

    let date = new Date(Date.now() - daysAmount);
    // Set a random hour, minute, and second
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    date.setSeconds(Math.floor(Math.random() * 60));
    return date;
}

async function createDeliveryNotes(companies: { companyId: number }[], dumpsters: DumpsterData[]) {


    for (let i = 0; i < amountOfDeliveryNotes; i++) {

        let randomNum = Math.floor(Math.random() * 120);
        let company = companies[randomNum % companies.length];


        let deliveryNoteData: DeliveryNoteDataToSend = {
            isCourtesy: false,
            companyId: company.companyId,
            date: getRandomDate(),
            observations: `Observaciones de la entrega ${i} para la empresa ${company.companyId}`,
            operations: await createOperations(dumpsters)
        }
        await createDeliveryNote(deliveryNoteData);
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

    const {notes} = await getDeliveryNotes(filter)


    console.log("-----------Printing some delivery notes----------------");

    for (let deliveryNote of notes) {
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