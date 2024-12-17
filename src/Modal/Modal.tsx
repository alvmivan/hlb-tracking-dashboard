import {ReactNode, useEffect} from 'react';
import './Modal.css';

interface ModalProps {
    width?: number;
    height?: number;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export const Modal = ({
                          width = 75,
                          height = 66,
                          onClose = () => {
                          },
                          title = "",
                          children,
                      }: ModalProps) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);

        // Cleanup listener when component unmounts
        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div
                className="modal-content"
                style={{
                    width: `${width}%`,
                    height: `${height}%` 
                }}
            >
                <button className="modal-close-button" onClick={onClose}>
                    ×
                </button>

                {title && <h2 className="modal-title">{title}</h2>}

                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}; 