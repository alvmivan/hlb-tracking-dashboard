import { ChangeEvent } from "react";
import "./Toggle.css";

export const Toggle = (props: { value: boolean, onChange: (value: boolean) => void, label: string }) => 
{
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        props.onChange(e.target.checked);
    };
    
    return (
        <div className="toggle-container" data-tooltip={props.label}>
            <label className="toggle-switch">
                <input type="checkbox" checked={props.value} onChange={onChange}/>
                <span className="toggle-slider"></span>
            </label>
        </div>
    )    
}