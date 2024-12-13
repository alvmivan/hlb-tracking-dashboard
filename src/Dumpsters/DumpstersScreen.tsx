import {DumpsterData, getAllDumpsters} from "../lib/hlb-api-library/src/dumpsters/domain/dumpstersServices"
import {useEffect, useState} from "react";
import {LocalizedLabel} from "../Localization/LocalizedLabel.tsx";
import "./Dumpsters.css";
import { DumpstersMap } from "./DumpstersMap.tsx";

async function fetchDumpsters(): Promise<DumpsterData[]> {
    const data: { dumpsters: DumpsterData[] } = await getAllDumpsters();
    return data.dumpsters;
}

const DumpsterState = (props: { state: string }) => {

    type state = 'GOOD' | 'BURNED' | 'NEED_REPAIR';

    const styleMap = {
        'GOOD': "dumpster-state-label-good",
        'BURNED': "dumpster-state-label-burned",
        'NEED_REPAIR': "dumpster-state-label-need-repair"
    }

    const specificStyle = styleMap[props.state as state];

    const label = <LocalizedLabel labelKey={props.state}/>
    return <span className={"dumpster-state-label " + specificStyle}> {label} </span>


}

const DumpsterDataMini = (props: { dumpster: DumpsterData }) =>
    <span>
        #{props.dumpster.dumpsterCode} <DumpsterState state={props.dumpster.physicalState}/>
    </span>

const DumpsterSelectionColumn = (props: {
    dumpsters: DumpsterData[],
    selectDumpster: (dumpster: DumpsterData) => void,
    selected: DumpsterData | undefined
}) => {


    const isSelected = (dumpster: DumpsterData) => {
        return props.selected && props.selected.dumpsterCode === dumpster.dumpsterCode;
    }

    return <div className={"dumpster-selection-column-container style-scrollable-column75"}>
        {props.dumpsters.map((dumpster, index) => {
            const className = isSelected(dumpster) ? "selected-dumpster" : "";

            return <div key={index} className={"dumpster-entry " + className}
                        onClick={() => props.selectDumpster(dumpster)}>
                <DumpsterDataMini dumpster={dumpster}/>
            </div>
        })}
    </div>;
}


export const DumpstersScreen = () => {

    const [dumpsters, setDumpsters] = useState<DumpsterData[]>([]);
    const [selectedDumpster, setSelectedDumpster] = useState<DumpsterData | undefined>(undefined);


    useEffect(() => {
        if (dumpsters.length === 0) {
            fetchDumpsters().then(setDumpsters);
        }
    }, [dumpsters, setDumpsters]);


    return <div>
        <h1><LocalizedLabel labelKey={"dumpsters"}/></h1>
        <div className="dumpsters-screen-container">
            <DumpsterSelectionColumn 
                dumpsters={dumpsters} 
                selectDumpster={setSelectedDumpster} 
                selected={selectedDumpster}
            />
            <DumpstersMap 
                dumpsters={dumpsters} 
                selectDumpster={setSelectedDumpster} 
                selected={selectedDumpster}
            />
            {/*<DumpsterInfo dumpster={selectedDumpster}/>*/}
        </div>
    </div>


}