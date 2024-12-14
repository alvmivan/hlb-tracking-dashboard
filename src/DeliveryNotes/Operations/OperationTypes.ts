import {getAllOperationTypes} from "../../lib/hlb-api-library/src/deliveryNotes/domain/deliveryNotesService.ts";

export type OperationType = {
    operationTypeId: number;
    name: string;
    description: string;
}

let operationTypes = new Map<number, OperationType>();

const loadOperationTypes = async () => {
    const types: OperationType[] = await getAllOperationTypes();

    operationTypes = new Map<number, OperationType>();

    types.forEach(type => {
        operationTypes.set(type.operationTypeId, type);
    });   

}

export const getOperationType = (operationTypeId: number) => {
    return operationTypes.get(operationTypeId)!;
}

export const loadOperationTypesStep = {
    name: "loadOperationTypes",
    action: loadOperationTypes
}