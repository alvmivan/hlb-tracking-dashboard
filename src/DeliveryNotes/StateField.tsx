import {DeliveryNoteFullData} from "../lib/hlb-api-library/src/deliveryNotes/domain/deliveryNotesService.ts";
import "../Buttons.css"
import {LocalizedLabel} from "../Localization/LocalizedLabel.tsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPen, faXmark } from '@fortawesome/free-solid-svg-icons';

export function StateField(props: {
    note: DeliveryNoteFullData,
    setNotes: (notes: DeliveryNoteFullData[]) => void,
    notes: DeliveryNoteFullData[]
}) {

    // const {note, setNotes, notes} = props;

    const approvalStatus = props.note.approvalStatus;


    if (approvalStatus === 'PENDING') {
        return <div className="button-container">
            <button className="style-button green tooltip">
                <FontAwesomeIcon icon={faCheck} />
                <span className="tooltiptext">
                    <LocalizedLabel labelKey={"approve"}></LocalizedLabel>
                </span>
            </button>

            <button className="style-button yellow tooltip">
                <FontAwesomeIcon icon={faPen} />
                <span className="tooltiptext">
                    <LocalizedLabel labelKey={"edit"}></LocalizedLabel>
                </span>
            </button>

            <button className="style-button red tooltip">
                <FontAwesomeIcon icon={faXmark} />
                <span className="tooltiptext">
                    <LocalizedLabel labelKey={"reject"}></LocalizedLabel>
                </span>
            </button>
        </div>
    }

    return ('otro? ' + approvalStatus);

}