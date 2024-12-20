import {DumpsterCreation} from "./DumpsterCreation.tsx";
import {ReactNode, useState} from "react";
import {DumpsterData} from "../lib/hlb-api-library/src/dumpsters/domain/dumpstersServices.ts";
import {DateField} from "../DeliveryNotes/Fields/DateField.tsx";
import {LocalizedLabel} from "../Localization/LocalizedLabel.tsx";
import {CreateButton, DeleteButton} from "../GlobalButtons.tsx";
import {DumpsterState} from "./DumpsterState.tsx";


function DataPairCard(props: { children: any }) {
    return <div className={"style-force-vertical style-card-15 style-padding-05"}>
        {props.children}
    </div>

}

function DumpsterDataComponent(props: {
    dumpster: DumpsterData,
    onDelete: (dumpster: DumpsterData) => void,
    children?: ReactNode
}) {

    const {dumpster} = props;
    return (
        <>

            {props.children}
            <DataPairCard>
                <LocalizedLabel labelKey={"dumpster_code"}/>
                <div>{dumpster.dumpsterCode}</div>
            </DataPairCard>

            <DataPairCard>
                <LocalizedLabel labelKey={"dumpster_type"}/>
                <div>{dumpster.type}</div>
            </DataPairCard>

            <DataPairCard>
                <LocalizedLabel labelKey={"dumpster_state"}/>
                <div style={{padding: "4px"}}><DumpsterState state={dumpster.physicalState}/></div>
            </DataPairCard>

            {dumpster.lastStateChange ?
                <DataPairCard>
                    <LocalizedLabel labelKey={"last_state_change"}/>
                    <DateField date={dumpster.lastStateChange}/>
                </DataPairCard>
                : null
            }

            <DataPairCard>
                <div className={"style-content-justified"}>
                    <DeleteButton onClick={() => props.onDelete(dumpster)} label={"delete_dumpster"}/>
                </div>

            </DataPairCard>
        </>)
}

export function DumpsterInspectorPanel(props: {
    selectedDumpster: DumpsterData | undefined,
    onDelete: (dumpster: DumpsterData) => void
}) {

    const [isCreating, setIsCreating] = useState(false);

    const {selectedDumpster, onDelete} = props;


    return <div
        className={" style-card-15 style-force-vertical style-children-directs-height style-content-spacing-05 style-padding-05 style-width-15"}>
        {isCreating ?
            <DumpsterCreation
                onCancel={() => setIsCreating(false)}
                onCreated={() => setIsCreating(false)}
            />
            :
            selectedDumpster ?
                <DumpsterDataComponent
                    dumpster={selectedDumpster}
                    onDelete={onDelete}
                >
                    <CreateButton onClick={() => setIsCreating(true)} label={"create_dumpster"}/>
                </DumpsterDataComponent>
                : <CreateButton onClick={() => setIsCreating(true)} label={"create_dumpster"}/>
        }
    </div>


}