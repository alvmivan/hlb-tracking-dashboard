import {getOperationType} from "./OperationTypes.ts";
import {DeliveryNoteData} from "../../lib/hlb-api-library/src/deliveryNotes/domain/deliveryNotesService.ts";
import {CompanyNameField} from "../Fields/CompanyField.tsx";
import {ReactNode} from "react";


export const OperationTypeField = (props: { operationType: number, isReadOnly: boolean, note: DeliveryNoteData }) => {

    const {operationType, isReadOnly, note} = props;
    const operationTypeData = getOperationType(operationType);

    const clientKey = "Cliente";
    const opType = operationTypeData.name;

    if (isReadOnly) {

        let content: string | ReactNode;
        if (opType.includes(clientKey)) {
            // use <CompanyNameField companyId={note.companyId}/> in the place where Cliente was
            const before = opType.substring(0, opType.indexOf(clientKey));
            const after = opType.substring(opType.indexOf(clientKey) + clientKey.length);
            content = <>{before}< CompanyNameField companyId={note.companyId} />{after}</>
        } else {
            content = opType;
        }


        return content;
    }

}