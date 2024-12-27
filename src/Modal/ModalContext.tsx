import {createContext, ReactNode, useContext, useState} from 'react';
import {Modal} from './Modal';
import {localizeKey} from "../Localization/LocalizeKey.ts";
import {OptionsModal} from "./OptionsModal.tsx"; // El componente que compartiste


export interface OptionButtonData {
    onOk: () => void;
    onCancel: () => void;
    okText: string;
    cancelText: string;
}

interface ModalProps {
    width?: number;
    height?: number;
    onClose: () => void;
    title: string;
    children: ReactNode;
    optionButtons?: OptionButtonData | undefined;

}

interface ModalContextProps {
    showModal: (props: Omit<ModalProps, 'onClose'>) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({children}: { children: ReactNode }) => {
    const [modalProps, setModalProps] = useState<ModalProps | null>(null);

    const showModal = (props: Omit<ModalProps, 'onClose'>) => {
        setModalProps({
            ...props,
            onClose: closeModal,
        });
    };

    const closeModal = () => {
        setModalProps(null);
    };


    const safeLocalize = (key: string) => {
        const value = localizeKey(key);
        return !value || value.startsWith("<<") ? key : value;
    }

    let modalContent = <></>

    if (modalProps) {
        const innerModalProps: ModalProps = {...modalProps, title: safeLocalize(modalProps.title)};

        if (modalProps.optionButtons) {
            const optionModalProps = {...innerModalProps, ...innerModalProps.optionButtons!};
            modalContent = <OptionsModal {...optionModalProps} >
                {modalProps.children}
            </OptionsModal>
        } else {
            modalContent = <Modal {...innerModalProps}>
                {modalProps.children}
            </Modal>
        }

    }


    return (
        <ModalContext.Provider value={{showModal, closeModal}}>
            {children}
            {modalContent}
        </ModalContext.Provider>
    );
};

export const useModal = (): ModalContextProps => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal debe ser usado dentro de un ModalProvider');
    }
    return context;
};
