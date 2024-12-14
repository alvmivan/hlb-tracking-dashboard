import {DumpsterData, getAllDumpsters} from "../lib/hlb-api-library/src/dumpsters/domain/dumpstersServices.ts";


let cache: DumpsterData[] = [];

let idToDumpster = new Map<number, DumpsterData>();

const loadDumpsters = async () => {
    const data: { dumpsters: DumpsterData[] } = await getAllDumpsters();
    cache = data.dumpsters;

    idToDumpster = new Map<number, DumpsterData>();
    cache.forEach(d => idToDumpster.set(d.dumpsterId, d));

}

export const getDumpster = (dumpsterId: number) => {
    return idToDumpster.get(dumpsterId);
}


export const loadDumpstersStep = {
    name: "loadDumpsters",
    action: loadDumpsters
}