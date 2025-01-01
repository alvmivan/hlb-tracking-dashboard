import {
    deleteDumpster as deleteDumpsterFromApi,
    DumpsterData,
    getAllDumpsters
} from "../lib/hlb-api-library/src/dumpsters/domain/dumpstersServices"
import {useEffect, useState} from "react";
import {LocalizedLabel} from "../Localization/LocalizedLabel.tsx";
import "./Dumpsters.css";
import {DumpstersMap} from "./DumpstersMap.tsx";
import {useParams} from "react-router-dom";
import {DumpsterInspectorPanel} from "./DumpsterInspectorPanel.tsx";
import {DumpsterLabelData, DumpsterState} from "./DumpsterState.tsx";

async function fetchDumpsters(): Promise<DumpsterData[]> {
    const data: { dumpsters: DumpsterData[] } = await getAllDumpsters();
    return data.dumpsters;
}

const hasValidCoordinates = (dumpster: DumpsterData) => {
    if (!dumpster.gpsCoordinates) return false;
    const gps = dumpster.gpsCoordinates;

    return gps.latitude && gps.latitude !== 0 && gps.longitude && gps.longitude !== 0;
}

export const DumpsterDataMini = (props: { dumpster: DumpsterData, onClick?: () => void, stateChange?: string }) => {
    const {dumpster, onClick, stateChange} = props;


    const handleClick = onClick || (() => {
    });

    const extraLabels: DumpsterLabelData[] = [
        ...(!hasValidCoordinates(dumpster) ? [{label: "no_gps", labelStyle: "no-gps"} as DumpsterLabelData] : []),
    ]

    return <span onClick={handleClick} className={onClick === undefined ? "" : "style-cursor-clickable"}>
        {dumpster.dumpsterCode}
        <DumpsterState state={dumpster.physicalState} extraLabels={extraLabels}/>
        {
            stateChange && stateChange !== dumpster.physicalState ? <> ➡ <DumpsterState state={stateChange}/> </>
                //todo dibujar la flecha con ícono de fontawesome
                : null
        }
    </span>;
}

export const DumpsterSelectionColumn = (props: {
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


const sortForGps = (dumpsters: DumpsterData[]) => {
    //then sort by code
    function compareStrings(a: string, b: string): number {

        // if both strings are numbers we compare them as numbers
        if (!isNaN(Number(a)) && !isNaN(Number(b))) {
            return Number(a) - Number(b);
        }

        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }

    function compareDumpsters(a: DumpsterData, b: DumpsterData): number {
        return compareStrings(a.dumpsterCode, b.dumpsterCode);
    }

    const withGps = dumpsters.filter(hasValidCoordinates).sort(compareDumpsters);
    const withoutGps = dumpsters.filter(d => !hasValidCoordinates(d)).sort(compareDumpsters);
    return [...withGps, ...withoutGps];
}


export const DumpstersScreen = () => {


    const [dumpsters, setDumpsters] = useState<DumpsterData[]>([]);
    const [selectedDumpster, setSelectedDumpster] = useState<DumpsterData | undefined>(undefined);
    const {dumpsterId} = useParams<{ dumpsterId: string }>();


    const deleteDumpster = async (dumpster: DumpsterData | undefined) => {
        if (!dumpster) return;
        const newDumpsters = dumpsters.filter(d => d.dumpsterId !== dumpster.dumpsterId);
        setSelectedDumpster(undefined);

        setDumpsters(newDumpsters);
        await deleteDumpsterFromApi(dumpster.dumpsterId);

    }

    useEffect(() => {
        if (dumpsters.length === 0) {
            fetchDumpsters()
                .then(dumps => sortForGps(dumps))
                .then((dumps) => {
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
            <div>
                <DumpsterInspectorPanel
                    selectedDumpster={selectedDumpster}
                    onDelete={deleteDumpster}
                />
            </div>

        </div>
    </div>


}
