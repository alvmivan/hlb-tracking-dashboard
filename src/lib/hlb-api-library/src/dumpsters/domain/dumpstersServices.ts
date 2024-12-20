import {AppConfig} from "../../shared/appContext";
import {handleError} from "../../shared/connectionUtils";
import {fetchAuthenticated} from "../../auth/domain/authenticatedRequests";

export type DumpsterMutableData = {
    readonly physicalState: string;
    readonly gpsCoordinates: GPSData | undefined;
}

export type DumpsterData = {
    readonly type: string;
    readonly dumpsterCode: string;
    readonly dumpsterId: number;
    readonly lastStateChange: Date | undefined;
} & DumpsterMutableData;


export type CreateDumpsterData = { type: string, dumpsterCode: string };


export async function createDumpster(createDumpsterData: CreateDumpsterData) {
    const API_URL = AppConfig.get("API_URL");
    const DUMPSTERS_URL = API_URL + '/dumpsters';
    const response = await fetch(`${DUMPSTERS_URL}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createDumpsterData)
    });
    await handleError(response);
    return await response.json();
}

export async function getDumpsterByCode(dumpsterCode: string): Promise<DumpsterData | undefined> {
    const API_URL = AppConfig.get("API_URL");
    const DUMPSTERS_URL = API_URL + '/dumpsters';
    const response = await fetch(`${DUMPSTERS_URL}/findDumpster/${dumpsterCode}`);
    if (response.status === 404) {
        return undefined;
    }
    await handleError(response);
    return await response.json();
}

/**
 *
 * @param dumpsterData {{

 physicalState: string | undefined;
 gpsCoordinates: {
 latitude: number,
 longitude: number
 } | undefined;

 }}
 * @returns {Promise<any>}
 */

export type GPSData = {
    latitude: number,
    longitude: number
};
export type UpdateDumpsterData = {
    dumpsterCode: string;
    physicalState: string | undefined;
    gpsCoordinates: GPSData | undefined;
}

export async function updateDumpsterState(dumpsterData: UpdateDumpsterData) {
    const API_URL = AppConfig.get("API_URL");
    const DUMPSTERS_URL = API_URL + '/dumpsters';
    const response = await fetch(`${DUMPSTERS_URL}/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dumpsterData)
    });
    await handleError(response);
}

export type PaginationData = { page: number, pageSize: number };

export async function getAllDumpsters(pagination: PaginationData | undefined = undefined): Promise<{
    dumpsters: DumpsterData[]
}> {
    const queryParams = new URLSearchParams(pagination as any).toString();
    const API_URL = AppConfig.get("API_URL");
    const DUMPSTERS_URL = API_URL + '/dumpsters';
    const urlWithParams = `${DUMPSTERS_URL}/all?${queryParams}`;

    const response = await fetch(urlWithParams, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    await handleError(response);
    return await response.json();
}


export async function deleteDumpster(dumpsterId: number): Promise<void> {
    const API_URL = AppConfig.get("API_URL");
    const DUMPSTERS_URL = API_URL + '/dumpsters';
    const response = await fetchAuthenticated(`${DUMPSTERS_URL}/delete/${dumpsterId}`, 'DELETE', {});
    if (response.status === 404) {
        console.error(`Dumpster with ID ${dumpsterId} not found`);
        return;
    }
    await handleError(response);
    return;
}
