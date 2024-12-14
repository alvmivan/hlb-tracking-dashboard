import {DeliveryNoteFullData} from "../lib/hlb-api-library/src/deliveryNotes/domain/deliveryNotesService.ts";
import {useState} from "react";

export type DeliveryNoteEditorProps = {
    data: DeliveryNoteFullData;
    setNewData: (newData: DeliveryNoteFullData) => void;    
}

export const DeliveryNoteEditor = (props : DeliveryNoteEditorProps) => {
    
    const {data, setNewData} = props;
    const [currentData, setCurrentData] = useState(data);
    
    const saveData = () => {
        setNewData(currentData);
    }
    
    return (
        <div>
            <h1>Delivery Note Editor</h1>
            <button onClick={saveData}>Save</button>
        </div>
    );
    
    
}