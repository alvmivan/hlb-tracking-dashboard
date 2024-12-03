import {localizeKey} from "./LocalizeKey.ts";



export const LocalizedLabel = (props: { labelKey: string, className?: string , style?:any}) => {

    return (<span style={props.style} className={props.className}>
        {localizeKey(props.labelKey)}
    </span>);

}