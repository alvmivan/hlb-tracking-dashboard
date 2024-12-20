import {AppConfig} from "../../shared/appContext";
import {handleError, sendGet} from "../../shared/connectionUtils";
import {fetchAuthenticated} from "../../auth/domain/authenticatedRequests";
import {GPSData} from "../../dumpsters/domain/dumpstersServices";


export type DeliveryNoteOperationData = {
    dumpsterId: number;
    operationTypeId: number;
    gpsLocation: { latitude: number, longitude: number }; // ubicación del camión en ese momento
    dumpsterPhysicalStatusChange?: string;
}

export type DeliveryNoteData = {
    operations: DeliveryNoteOperationData[];
    date: Date;
    observations: string;
    isCourtesy: boolean;
    companyId: number;
    approvalStatus: string;
    noteId: number;
}


export type DeliveryNoteDataToSend = Omit<DeliveryNoteData, 'approvalStatus' | 'noteId'>


export type OperationData = {
    operationTypeId: number;
    name: string;
    description: string;
    gpsDestination?: GPSData;
}

export type DeliveryNoteFullData = DeliveryNoteData & {
    userId: string; // it's the driver id
}
export type ApprovedDeliveryNoteData = DeliveryNoteData & {
    wasEdited?: boolean;
    driverId: string;
}

export type DeliveryNotesFilterData = {
    byCompanyId?: number[];
    dateRange?: { from: Date, to: Date };
    byApproval?: string[];
    byOperatorId?: string[];
    page?: number;
}

export async function createDeliveryNote(deliveryNoteData: DeliveryNoteDataToSend) {
    const ApiUrl = AppConfig.get("API_URL");
    const DELIVERY_NOTES_URL = `${ApiUrl}/delivery-notes`;
    const createDeliveryNoteEndpoint = DELIVERY_NOTES_URL + "/create"
    const response = await fetchAuthenticated(createDeliveryNoteEndpoint, 'POST', deliveryNoteData);
    await handleError(response);
}


export type PaginatedNotes = {
    notes: DeliveryNoteFullData[],
    totalPages: number
};

export async function getDeliveryNotes(deliveryNotesFilters: DeliveryNotesFilterData): Promise<PaginatedNotes> {
    const ApiUrl = AppConfig.get("API_URL");
    const DELIVERY_NOTES_URL = `${ApiUrl}/delivery-notes/get-all`;

    const response = await fetchAuthenticated(DELIVERY_NOTES_URL, 'POST', deliveryNotesFilters);


    await handleError(response);
    return await response.json();
}

export async function getAllOperationTypes(): Promise<OperationData[]> {
    const ApiUrl = AppConfig.get("API_URL");
    const getOperationTypesUrl = `${ApiUrl}/delivery-notes/operation-types`;
    const response = await fetchAuthenticated(getOperationTypesUrl, "GET", null);
    await handleError(response);
    const {operationTypes} = await response.json();
    return operationTypes;
}


export async function approveDeliveryNote(note: ApprovedDeliveryNoteData): Promise<number | null> {
    const ApiUrl = AppConfig.get("API_URL");
    const DELIVERY_NOTES_URL = `${ApiUrl}/delivery-notes`;
    const approveDeliveryNoteEndpoint = DELIVERY_NOTES_URL + "/approve"
    const response = await fetchAuthenticated(approveDeliveryNoteEndpoint, 'POST', note);

    if (response.status === 400) {
        return null; // there was an error internally to create, but it was not a 500 
    }

    await handleError(response);

    const {validationId} = await response.json();
    return validationId;
}