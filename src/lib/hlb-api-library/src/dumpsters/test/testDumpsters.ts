import {eraseBackend, prepareConfig} from "../../shared/testUtils";
import {createDumpster, getAllDumpsters, getDumpsterByCode, updateDumpsterState} from "../domain/dumpstersServices";

const createDumpster1 = {
    type: "regular",
    dumpsterCode: "1",
}

const createDumpster2 = {
    type: "regular",
    dumpsterCode: "2",
}

const createDumpster3 = {
    type: "regular",
    dumpsterCode: "3",
}

export const createSomeDumpstersAndModifyThemThenAskForThem = async () => {
    prepareConfig();
    await eraseBackend();

    await createDumpster(createDumpster1);
    console.log("Dumpster 1 created");
    await createDumpster(createDumpster2);
    console.log("Dumpster 2 created");


    const dumpster1Data = await getDumpsterByCode("1");
    console.log("Dumpster 1 data: ", dumpster1Data);


    const dumpster2Data = await getDumpsterByCode("2");
    console.log("Dumpster 2 data: ", dumpster2Data);

    //preguntamos por el dumpster 3 que NO está creado
    const dumpster3Data = await getDumpsterByCode("3");
    console.log("Dumpster 3 data: (tendría que estar vacio) ", dumpster3Data);


    //ahora pido todos los dumpsters
    const allDumpsters = await getAllDumpsters();
    console.log("All dumpsters: ", allDumpsters);

    //ahora modifico el dumpster 1, le pongo estado BURNED
    const updateDumpster1 = {
        physicalState: "BURNED",
        dumpsterCode: "1",
        gpsCoordinates: undefined,
    }
    await updateDumpsterState(updateDumpster1);
    console.log("Dumpster 1 updated a state burned");

    // ahora vuelvo a printear todos los dumpsters
    const allDumpsters2 = await getAllDumpsters();
    console.log("todos los dumpsters, esta vez con dumpster 1 en estado burned: \n", allDumpsters2);


}