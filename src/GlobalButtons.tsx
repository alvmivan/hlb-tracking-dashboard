import {localizeKey} from "./Localization/LocalizeKey.ts";
import {LocalizedLabel} from "./Localization/LocalizedLabel.tsx";

export type ButtonProps = {
    onClick: () => void;
    label: string;
    className?: string;
}

const GlobalButton = (props: ButtonProps) => {

    const label = props.label;
    let span = <span>{label}</span>
    if (localizeKey(label)) {
        span = <LocalizedLabel labelKey={label}/>
    }
    return (
        <button className={"global-button " + props.className} onClick={props.onClick}>
            {span}
        </button>
    )
}

export const OkButton = (props: ButtonProps) => {
    return <GlobalButton {...props} className="ok"/>
}

export const CancelButton = (props: ButtonProps) => {
    return <GlobalButton {...props} className="cancel"/>
}


export type OkCancelBarProps = {
    onOk: () => void;
    onCancel: () => void;
    okLabel: string;
    cancelLabel: string;
}
export const OkCancelButtons = (props: OkCancelBarProps) => {

    return (
        <div className="ok-cancel-bar">
            <OkButton onClick={props.onOk} label={props.okLabel}/>
            <CancelButton onClick={props.onCancel} label={props.cancelLabel}/>
        </div>
    )
}