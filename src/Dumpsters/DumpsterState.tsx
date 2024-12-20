import {LocalizedLabel} from "../Localization/LocalizedLabel.tsx";

export const DumpsterState = (props: { state: string }) => {

    type state = keyof typeof styleMap;

    const styleMap = {
        'GOOD': "dumpster-state-label-good",
        'BURNED': "dumpster-state-label-burned",
        'NEED_REPAIR': "dumpster-state-label-need-repair"
    }

    const specificStyle = styleMap[props.state as state];

    const label = <LocalizedLabel labelKey={props.state}/>
    return <span className={"dumpster-state-label " + specificStyle}> {label} </span>


}