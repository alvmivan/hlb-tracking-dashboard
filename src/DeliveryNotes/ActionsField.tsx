import {
    approveDeliveryNote,
    DeliveryNoteFullData, rejectDeliveryNote
} from "../lib/hlb-api-library/src/deliveryNotes/domain/deliveryNotesService.ts";
import "../Buttons.css"
import {LocalizedLabel} from "../Localization/LocalizedLabel.tsx";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faPen, faXmark} from '@fortawesome/free-solid-svg-icons';
import {useModal} from "../Modal/ModalContext.tsx";
import {useLoading} from "../Loading/LoadingContext.tsx";
import {ReactNode} from "react";


export function ActionsField(props: {
    note: DeliveryNoteFullData,
    setNotes: (notes: DeliveryNoteFullData[]) => void,
    notes: DeliveryNoteFullData[],
    reload: () => void
}) {


    const {showModal, closeModal} = useModal();
    const {setLoading} = useLoading();

    const {note, reload} = props;

    const approvalStatus = props.note.approvalStatus;

    const wrapAction = async (func: () => Promise<void>) => {
        setLoading(true, false);
        await func();
        reload();
        setLoading(false, false);
    }


    const displayOptionsModal = (title: string, contentMessage: string, onOk: () => Promise<void>, okText: string, cancelText: string = "cancel") => {
        showModal({
            title,
            children: <LocalizedLabel labelKey={contentMessage}/>,
            height: 30,
            width: 40,
            optionButtons: {
                onOk: async () => {
                    closeModal();
                    await wrapAction(onOk);

                }, okText, cancelText, onCancel: closeModal,
            }
        });
    }

    const approve = async () => {

        await approveDeliveryNote({
            ...note,
            wasEdited: false,
            driverId: note.userId
        });
    }

    const reject = async () => {
        await rejectDeliveryNote(note.noteId);
    }

    const approveEdited = async () => {

        await approveDeliveryNote({
            ...note,
            isCourtesy: !note.isCourtesy, // para testear vamos a poner cómo diff que cambia el valor de cortesía
            wasEdited: true,
            driverId: note.userId
        });

    }


    const askApproval = () => displayOptionsModal(
        "approve_confirmation_title",
        "approve_confirmation_message",
        approve,
        "approve_action",
    )

    const askRejection = () => displayOptionsModal(
        "reject_confirmation_title",
        "reject_confirmation_message",
        reject,
        "reject_action"
    )


    const goEdition = () => displayOptionsModal(
        "edit_delivery_note",
        " Esta es la parte donde vamos a editar el remito :)",
        approveEdited,
        "save_and_approve"
    )


    if (approvalStatus === 'PENDING') {
        return <div className="button-container">
            <button className="style-button green tooltip" onClick={askApproval}>
                <FontAwesomeIcon icon={faCheck}/>
                <span className="tooltiptext">
                    <LocalizedLabel labelKey={"approve_button"}></LocalizedLabel>
                </span>
            </button>

            <button className="style-button yellow tooltip" onClick={goEdition}>
                <FontAwesomeIcon icon={faPen}/>
                <span className="tooltiptext">
                    <LocalizedLabel labelKey={"edit_button"}></LocalizedLabel>
                </span>
            </button>

            <button className="style-button red tooltip" onClick={askRejection}>
                <FontAwesomeIcon icon={faXmark}/>
                <span className="tooltiptext">
                    <LocalizedLabel labelKey={"reject_button"}></LocalizedLabel>
                </span>
            </button>
        </div>
    }

    return ('otro? ' + approvalStatus);

}
