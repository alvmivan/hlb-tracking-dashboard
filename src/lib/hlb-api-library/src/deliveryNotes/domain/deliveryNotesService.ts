import {AppConfig} from "../../shared/appContext";
import {handleError, sendGet} from "../../shared/connectionUtils";
import {fetchAuthenticated} from "../../auth/domain/authenticatedRequests";
import {GPSData} from "../../dumpsters/domain/dumpstersServices";


export type DeliveryNoteOperationData = {
    dumpsterId: number;
    operationTypeId: number;
    gpsLocation: { latitude: number, longitude: number }; // ubicación del camión en ese momento        
}

export type DeliveryNoteData = {
    operations: DeliveryNoteOperationData[];
    date: Date;
    observations: string;
    isCourtesy: boolean;
    companyId: number;
}
export type OperationData = {
    operationTypeId: number;
    name: string;
    description: string;
    gpsDestination?: GPSData;
}

export type DeliveryNoteFullData = DeliveryNoteData & {
    userId: string; // it's the driver id
}


export type DeliveryNotesFilterData = {
    byCompanyId?: number[] ;
    dateRange?: { from: Date, to: Date } ;
    byApproval?: string[] ;
    byOperatorId?: string[] ;
    page?: number;
}

export async function createDeliveryNote(deliveryNoteData: DeliveryNoteData) {
    const ApiUrl = AppConfig.get("API_URL");
    const DELIVERY_NOTES_URL = `${ApiUrl}/delivery-notes`;
    const createDeliveryNoteEndpoint = DELIVERY_NOTES_URL + "/create"
    const response = await fetchAuthenticated(createDeliveryNoteEndpoint, 'POST', deliveryNoteData);
    await handleError(response);
}

export async function getDeliveryNotes(deliveryNotesFilters: DeliveryNotesFilterData): Promise<DeliveryNoteFullData[]> {
    const ApiUrl = AppConfig.get("API_URL");
    const DELIVERY_NOTES_URL = `${ApiUrl}/delivery-notes/get-all`;    
    
    const response = await fetchAuthenticated(DELIVERY_NOTES_URL , 'POST', deliveryNotesFilters);
    
    
    await handleError(response);
    const {notes} = await response.json();
    return notes;
}

export async function getAllOperationTypes(): Promise<OperationData[]> {
    const ApiUrl = AppConfig.get("API_URL");
    const getOperationTypesUrl = `${ApiUrl}/delivery-notes/operation-types`;
    const response = await sendGet(getOperationTypesUrl);
    await handleError(response);
    const {operationTypes} = await response.json();
    return operationTypes;

}