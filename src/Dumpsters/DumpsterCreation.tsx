import {useState} from "react";
import {createDumpster} from "../lib/hlb-api-library/src/dumpsters/domain/dumpstersServices.ts";
import {Modal} from "../Modal/Modal.tsx";
import {LocalizedLabel} from "../Localization/LocalizedLabel.tsx";
import {CancelButton, CreateButton, OkCancelButtons} from "../GlobalButtons.tsx";
import {ElementToRender} from "../Tables/TableComponent.tsx";
import {localizeKey} from "../Localization/LocalizeKey.ts";


export function DumpsterCreation(props: { onCancel: () => void, onCreated: () => void }) {


    const [dumpsterCode, setDumpsterCode] = useState<string>("");
    const [dumpsterType, setDumpsterType] = useState<string>("");


    const [modalContent, setModalContent] = useState<{ element: ElementToRender, title: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {onCreated, onCancel} = props;

    const showModal = (titleKey: string, element: ElementToRender) => {
        setModalContent({element, title: localizeKey(titleKey) || titleKey});
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    }

    const create = async () => {
        await createDumpster({
            dumpsterCode: dumpsterCode,
            type: dumpsterType
        });
    }

    const askCreation = async () => {
        showModal("create_dumpster_modal_title",
            <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>

                <div className={"style-justify-content"}>

                    <LocalizedLabel labelKey={"create_dumpster_modal_content"}/>
                    <div className={"style-self-margin-10 style-force-vertical"}>
                        <div><LocalizedLabel labelKey={"dumpster_code"}/></div>
                        <div>{dumpsterCode}</div>
                    </div>

                    <div className={"style-self-margin-10 style-force-vertical"}>
                        <div><LocalizedLabel labelKey={"dumpster_type"}/></div>
                        <div>{dumpsterType}</div>
                    </div>
                </div>

                <div style={{marginTop: 'auto'}}>
                    <OkCancelButtons
                        onOk={() => create().then(closeModal).then(onCreated)}
                        onCancel={closeModal}
                        okLabel={"create"}
                        cancelLabel={"cancel"}
                    />
                </div>
            </div>
        )
    }


    if (isModalOpen && modalContent) {
        return <Modal
            onClose={() => setIsModalOpen(false)}
            title={modalContent.title}
            height={40}
            width={50}

        >
            {modalContent.element}
        </Modal>
    }

    const cardType = " style-card-15 "


    return (
        <div className={`${cardType} style-justify-content  `}>

            <h3 className={"style-font-center-text"}><LocalizedLabel labelKey={"create_new_dumpster"} className={"style-font-single-line"}/></h3>

            <div className={cardType+
                "style-self-margin-horizontal- v5 " +
                "style-self-margin-vertical- v5 " +
                "style-force-vertical"}>

                <LocalizedLabel labelKey={"dumpster_code"} className={"style-label-field"}/>
                <input type="text" value={dumpsterCode} onChange={(e) => setDumpsterCode(e.target.value)}/>

            </div>
            <div className={cardType +
                "style-self-margin-horizontal- v5 " +
                "style-self-margin-vertical- v5 " +
                "style-force-vertical"}>

                <LocalizedLabel labelKey={"dumpster_type"} className={"style-label-field"}/>
                <input type="text" value={dumpsterType} onChange={(e) => setDumpsterType(e.target.value)}/>

            </div>
            <div className={cardType }>
                <CreateButton onClick={askCreation} label={"create"}/>
                <CancelButton onClick={props.onCancel} label={"cancel"}/>
            </div>


        </div>
    )


}
