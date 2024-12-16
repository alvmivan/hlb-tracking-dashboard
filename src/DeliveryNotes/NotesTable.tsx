import {
    DeliveryNoteData,
    DeliveryNoteFullData,
    DeliveryNoteOperationData
} from "../lib/hlb-api-library/src/deliveryNotes/domain/deliveryNotesService.ts";
import {useState} from "react";
import {UserField} from "./Fields/UserField.tsx";
import {CompanyField} from "./Fields/CompanyField.tsx";
import {DateField} from "./Fields/DateField.tsx";
import {TableComponent} from "../Tables/TableComponent.tsx";
import {NavigationArrow} from "../StandandaloneComponents/NavigationArrow.tsx";
import {OperationTypeField} from "./Operations/OperationTypeField.tsx";
import {DumpsterField} from "../Dumpsters/DumpsterField.tsx";
import {LocalizedLabel} from "../Localization/LocalizedLabel.tsx";

function OperationField(props: { note: DeliveryNoteData, operation: DeliveryNoteOperationData, onClick?: () => void }) {

    const onClick = props.onClick || (() => {
    });

    return (
        <span onClick={onClick} className={"style-cursor-clickable"}>
            <OperationTypeField
                operationType={props.operation.operationTypeId}
                isReadOnly={true}
                note={props.note}
            /> 
            <br/>
            <LocalizedLabel labelKey={"dumpster"}></LocalizedLabel> <DumpsterField
            dumpsterId={props.operation.dumpsterId}/>
            <br/>            
            GPS: {props.operation.gpsLocation.latitude} {props.operation.gpsLocation.longitude} 
        </span>

    )

}

type DecompressedOperationsFieldProps = {
    note: DeliveryNoteData,
    compress: () => void,
    operations: DeliveryNoteOperationData[]
}
function DecompressedOperationsField(props: DecompressedOperationsFieldProps) {
    const buttonStyle = {
        marginTop: '12px',
        marginLeft: '12px'
    }

    return (
        <div>
            <button className={"navigable-field-see navigable-field-see-rotate-90"} onClick={props.compress}
                    style={buttonStyle}>
                <NavigationArrow/>
            </button>

            <div className={"operation-list-container"}>
                {props.operations.map((operation, index) => {
                    return <div className={"operation-list-element"}>
                        <OperationField note={props.note} key={index} operation={operation}/>
                    </div>
                })}
            </div>
        </div>
    );
}


export function StateField(props: { note: DeliveryNoteFullData, setNotes: (notes: DeliveryNoteFullData[]) => void, notes: DeliveryNoteFullData[] }) {
    
    // const {note, setNotes, notes} = props;
    
    return <>Not Implemented</>
    
}



function CompressedOperationsField(props: { extend: () => void, operations: DeliveryNoteOperationData[] }) {
    const containerStyle = {
        position: 'relative' as const,
        display: 'flex',
        alignItems: 'center',
        paddingRight: '4px',
        margin: '4px',
        cursor: 'pointer'
    }

    return (
        <div style={containerStyle} onClick={props.extend}>
            <span>{props.operations.length} Operaciones</span>
            <NavigationArrow/>
        </div>
    );
}

export const NotesTable = (props: {
    data: DeliveryNoteFullData[],
    setNotes: (notes: DeliveryNoteFullData[]) => void
}) => {


    const [extendedNoteIndex, setExtendedNoteIndex] = useState<number[]>([]);

    const {data} = props;

    const headers = [
        "company",
        "driver",
        "operations",
        "observations",
        "date",
        "state",
    ];

    const rows = data.map((note: DeliveryNoteFullData, index) => {

        //shared fields:
        const userField = <UserField userId={note.userId}/>;
        const companyField = <CompanyField companyId={note.companyId}/>;
        const dateField = <DateField date={note.date}/>;
        const observationsField = note.observations;
        const stateField = <StateField
            note={note}
            setNotes={props.setNotes}
            notes={data}
        />


        const removeIndex = () => setExtendedNoteIndex(extendedNoteIndex.filter(i => i !== index));
        const addIndex = () => setExtendedNoteIndex([index, ...extendedNoteIndex]);

        if (note.operations.length === 1) {
            return [
                companyField,
                userField,
                <div className={"operation-list-element"}>
                    <OperationField note={note} operation={note.operations[0]}/>,
                </div>,
                observationsField,
                dateField,
                stateField
            ]
        }

        if (!extendedNoteIndex.includes(index))
            return [
                companyField,
                userField,
                <CompressedOperationsField operations={note.operations} extend={addIndex}/>,
                observationsField,
                dateField,
                stateField
            ]

        return [
            companyField,
            userField,
            <DecompressedOperationsField note={note} operations={note.operations} compress={removeIndex}/>,
            observationsField,
            dateField,
            stateField
        ]


    });

    const sizes = [2, 2, 8, 3, 2, 2];

    return <TableComponent headers={headers} rows={rows} sizes={sizes}/>

}