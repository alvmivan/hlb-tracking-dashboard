import {eraseBackend, prepareConfig} from "../shared/testUtils";
import {UserData} from "../auth/domain/userData";
import {loginUser, registerUser, userExists} from "../auth/domain/userServices";
import {registerCompany} from "../companies/domain/companiesService";
import {
    createDumpster,
    CreateDumpsterData,
    DumpsterData,
    GPSData,
    UpdateDumpsterData, updateDumpsterState
} from "../dumpsters/domain/dumpstersServices";

// ---------- USERS ---------- 


const userMarcosAdmin = new UserData(
    "marcosAdmin", "Marcos Ivan", "Alvarez", "marcosadmin@gmail.com", "admin", 30_101_010,
    "123456");

const userTomiOperator = new UserData(
    "tomiOperator", "Tomas", "Diez", "tomiooperator@smooth.com", "operator", 30_101_011,
    "123456");

const userNievesAdmin = new UserData(
    "nievesAdmin", "Nieves", "Portesi", "nievesadmin@hotmail.com",
    "admin", 30_101_012, "123456");

const userJuanCarlosOperator = new UserData(
    "juanCarlosOperator", "Juan Carlos", "Doe", "jondoe@gmail.com",
    "operator", 30_101_013, "123456");

const users = [userMarcosAdmin, userTomiOperator, userNievesAdmin, userJuanCarlosOperator];

async function authUser(userData: UserData) {

    if (!await userExists(userData.userName)) {
        await registerUser(userData);
    }
    await loginUser(userData.userName, userData.password);
}

async function registerAllUsers() {
    for (let user of users) {
        if (!await userExists(user.userName)) {
            await registerUser(user);
        }
    }
}

//  ----------  COMPANIES ----------
const neotech = {companyId: 1, clientName: "NeoTech Innovations", address: "Av. Mitre 1234"};
const pangea = {companyId: 2, clientName: "Pangea Solutions", address: "Soler 567"};
const futura = {companyId: 3, clientName: "Futura Dynamics", address: "Av. Rivadavia 7654"};
const quantum = {companyId: 4, clientName: "Quantum Edge Labs", address: "Av. Corrientes 987"};


const companies: { companyId: number, clientName: string, address: string }[] = [neotech, pangea, futura, quantum]

async function registerAllCompanies() {
    for (let company of companies) {
        await registerCompany(company);

    }
}

//  ----------  DUMPSTERS ----------

type DumpsterSeederInfo = {
    initial: CreateDumpsterData,
    toUpdate: Partial<UpdateDumpsterData>,
}

const dumpster01: DumpsterSeederInfo = {
    initial: {
        type: "chico",
        dumpsterCode: "1",
    },
    toUpdate: {
        physicalState: "NEED_REPAIR",
    },
}

const dumpster02: DumpsterSeederInfo = {
    initial: {
        type: "chico",
        dumpsterCode: "2",
    },
    toUpdate: {
        // is good
    },
}


const dumpster03: DumpsterSeederInfo = {
    initial: {
        type: "grande",
        dumpsterCode: "3",
    },
    toUpdate: {
        physicalState: "NEED_REPAIR",
    },
}

const dumpster04: DumpsterSeederInfo = {
    initial: {
        type: "grande",
        dumpsterCode: "4",
    },
    toUpdate: {
        // is good
    },
}

const dumpsters: DumpsterSeederInfo[] = [dumpster01, dumpster02, dumpster03, dumpster04];

async function newDumpster(dumpsterInfo: DumpsterSeederInfo) {
    // create dumpster
    await createDumpster(dumpsterInfo.initial);
    // update dumpster
    if (dumpsterInfo.toUpdate.physicalState || dumpsterInfo.toUpdate.gpsCoordinates) {
        await updateDumpsterState({
            dumpsterCode: dumpsterInfo.initial.dumpsterCode,
            physicalState: dumpsterInfo.toUpdate.physicalState || undefined,
            gpsCoordinates: dumpsterInfo.toUpdate.gpsCoordinates || undefined,
        });
    }
}

async function createAllDumpsters() {
    for (let dumpster of dumpsters) {
        await newDumpster(dumpster);
    }

}


export async function seederForDemo() {
    prepareConfig();
    await eraseBackend();
    await registerAllUsers();
    await registerAllCompanies();
    await createAllDumpsters();


}