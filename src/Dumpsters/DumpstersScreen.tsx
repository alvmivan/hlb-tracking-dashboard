import {DumpsterData, getAllDumpsters} from "../lib/hlb-api-library/src/dumpsters/domain/dumpstersServices"
import {useEffect, useState} from "react";
import {LocalizedLabel} from "../Localization/LocalizedLabel.tsx";
import "./Dumpsters.css";
import {DumpstersMap} from "./DumpstersMap.tsx";
import {useParams} from "react-router-dom";

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

export const DumpsterDataMini = (props: { dumpster: DumpsterData, onClick?: () => void }) => {
    const {dumpster, onClick} = props;

    
    const handleClick = onClick || (() => {
    });

    return <span onClick={handleClick} className={onClick === undefined ? "" : "style-cursor-clickable"}>
        {dumpster.dumpsterCode} <DumpsterState state={dumpster.physicalState}/>
    </span>;
}

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

    const {dumpsterId} = useParams<{ dumpsterId: string }>();


    useEffect(() => {
        if (dumpsters.length === 0) {
            fetchDumpsters().then((dumps) => {
                console.log("dumpsterId", dumpsterId, dumps);
                if (dumpsterId) {
                    const selected = dumps.find(d => d.dumpsterId === parseInt(dumpsterId));
                    if (selected) {
                        setSelectedDumpster(selected);
                        console.log("selected", selected);
                    }
                }
                setDumpsters(dumps);

            });
        }
    }, [dumpsters, setDumpsters, dumpsterId, setSelectedDumpster]);


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