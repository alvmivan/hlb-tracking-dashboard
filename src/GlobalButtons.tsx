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
        span = <LocalizedLabel labelKey={label}  />
    }
    return (
        <button className={"global-button " + props.className} onClick={props.onClick}>
            {span}
        </button>
    )
}

export const OkButton = (props: ButtonProps) => <GlobalButton {...props} className="ok"/>
export const CancelButton = (props: ButtonProps) => <GlobalButton {...props} className="cancel"/>
export const CreateButton = (props: ButtonProps) => <GlobalButton {...props} className="create"/>
export const DeleteButton = (props: ButtonProps) => <GlobalButton {...props} className="delete"/>

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
