//self invoking function
import {registerUserFlow} from "./auth/debug/flows/registerUserFlow";
import {userExistsFlow} from "./auth/debug/flows/userExistsFlow";
import {loginUserFlow} from "./auth/debug/flows/loginUserFlow";
import {registerClientFlow} from "./companies/test/testCompanyService";
import {createSomeDumpstersAndModifyThemThenAskForThem} from "./dumpsters/test/testDumpsters";
import {eraseBackend} from "./shared/testUtils";
import {createSomeDeliveryNotes} from "./deliveryNotes/test/createSomeDeliveryNotes";
import {seederForDemo} from "./seeding/seederForDemo";


const functions = {
    // loginUserFlow,
    // registerUserFlow,
    // userExistsFlow,
    // loginUserFlow,
    // registerClientFlow,
    //createSomeDumpstersAndModifyThemThenAskForThem,
    // createSomeDeliveryNotes: createSomeDeliveryNotes,
    seederForDemo: seederForDemo
}


async function runTests() {


    try {

        for (const key in functions) {
            if (Object.hasOwnProperty.call(functions, key)) {
                const element = functions[key as keyof typeof functions];
                await element();
                console.log("Function: ", key, " ok");
            }
        }
    } catch (error) {
        console.error(error);
    }
}


async function testClients() {
    await eraseBackend();
    await runTests(); 
}

(async () => {
    await testClients()
})();