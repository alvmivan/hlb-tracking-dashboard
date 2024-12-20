import {
    approveDeliveryNote,
    DeliveryNoteFullData
} from "../lib/hlb-api-library/src/deliveryNotes/domain/deliveryNotesService.ts";
import "../Buttons.css"
import {LocalizedLabel} from "../Localization/LocalizedLabel.tsx";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faPen, faXmark} from '@fortawesome/free-solid-svg-icons';
import {useContext, useState} from "react";
import {ElementToRender} from "../Tables/TableComponent.tsx";
import {Modal} from "../Modal/Modal.tsx";
import {localizeKey} from "../Localization/LocalizeKey.ts";
import {OkCancelButtons} from "../GlobalButtons.tsx";


export function ActionsField(props: {
    note: DeliveryNoteFullData,
    setNotes: (notes: DeliveryNoteFullData[]) => void,
    notes: DeliveryNoteFullData[],
    reload: () => void
}) {

    const [modalContent, setModalContent] = useState<{ element: ElementToRender, title: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const {note, reload} = props;

    if (isModalOpen && modalContent) {
        return <Modal
            onClose={() => setIsModalOpen(false)}
            title={modalContent.title}
            height={30}
            width={50}

        >
            {modalContent.element}
        </Modal>
    }

    const showModal = (titleKey: string, element: ElementToRender) => {
        setModalContent({element, title: localizeKey(titleKey) || titleKey});
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    }

    const approvalStatus = props.note.approvalStatus;

    const approve = async () => {
        console.log("will approve ... testing... ");
        //await 1 sec
        await approveDeliveryNote({
            ...note,
            wasEdited: false,
            driverId: note.userId
        });
        
        
    }

    const reject = async () => {
        console.log("will reject ... testing... ");
        await new Promise<void>((resolve) => {
            setTimeout(resolve, 1000);
        });

        reload();
    }


    const askApproval = async () => {
        showModal("approve_confirmation_title",
            <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                <div>
                    <LocalizedLabel labelKey={"approve_confirmation_message"}/>
                </div>

                <div style={{marginTop: 'auto'}}>
                    <OkCancelButtons
                        onOk={() => approve().then(closeModal).then(()=>{
                            reload(); 
                        })}
                        onCancel={closeModal}
                        okLabel={"approve_action"}
                        cancelLabel={"cancel"}
                    />
                </div>
            </div>
        )
    }

    const askRejection = () => {
        showModal("reject_confirmation_title",
            <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                <div>
                    <LocalizedLabel labelKey={"reject_confirmation_message"}/>
                </div>

                <div style={{marginTop: 'auto'}}>
                    <OkCancelButtons
                        onOk={() => reject().then(closeModal)}
                        onCancel={closeModal}
                        okLabel={"reject_action"}
                        cancelLabel={"cancel"}
                    />
                </div>
            </div>
        )
    }


    const goEdition = () => {

    }


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
