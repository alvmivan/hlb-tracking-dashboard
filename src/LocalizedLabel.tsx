import {localizeKey} from "./LocalizeKey.ts";



export const LocalizedLabel = (props: { labelKey: string, className?: string }) => {

    //si no tiene classname usar un frag, sino usar un div
    if (props.className) {
        return (<div className={props.className}>
            {localizeKey(props.labelKey)}
        </div>);
    }
    return (<>
        {localizeKey(props.labelKey)}
    </>);

}