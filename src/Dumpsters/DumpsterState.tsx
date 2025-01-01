import {LocalizedLabel} from "../Localization/LocalizedLabel.tsx";

export const DumpsterState = (props: { state: string, extraLabels?: DumpsterLabelData[] }) => {

    type state = keyof typeof styleMap;

    const styleMap = {
        'GOOD': "dumpster-state-label-good",
        'BURNED': "dumpster-state-label-burned",
        'NEED_REPAIR': "dumpster-state-label-need-repair"
    }

    const specificStyle = styleMap[props.state as state];

    const label = <LocalizedLabel labelKey={props.state}/>
    return <>
        <span className={"dumpster-state-label " + specificStyle}> {label} </span>
        {
            props.extraLabels && props.extraLabels.length > 0 ?
                props.extraLabels.map((labelData, index) => <DumpsterLabel key={index} {...labelData}/>)
                : null
        }
    </>

}

export type LabelStyle = "no-gps" | "courtesy";
export type DumpsterLabelData = { label: string, labelStyle: LabelStyle };
export const DumpsterLabel = (props: DumpsterLabelData) => {

    const label = <LocalizedLabel labelKey={props.label}/>
    return <span className={"dumpster-state-label  dumpster-label-" + props.labelStyle}> {label} </span>

}

