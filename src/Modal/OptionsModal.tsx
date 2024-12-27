import {OptionButtonData} from "./ModalContext.tsx";
import {OkCancelButtons} from "../GlobalButtons.tsx";
import {Modal, ModalProps} from "./Modal.tsx";

export const OptionsModal = (props: ModalProps & OptionButtonData) => {

    const {onOk, onCancel, okText, cancelText} = props;

    return <Modal {...props}>
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <div>
                {props.children}
            </div>

            <div style={{marginTop: 'auto'}}>
                <OkCancelButtons
                    onOk={onOk}
                    onCancel={onCancel}
                    okLabel={okText}
                    cancelLabel={cancelText}
                />
            </div>
        </div>
    </Modal>
}