import React, { useState } from "react";
import { Modal } from "../Modal/Modal";
import "./HomeScreen.css";

export const HomeScreen: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div className="home-container">
            <h1>Home Screen</h1>
            
            <button 
                className="open-modal-button"
                onClick={handleOpenModal}
            >
                Abrir Modal de Ejemplo
            </button>

            {isModalOpen && (
                <Modal
                    width={50}
                    height={40}
                    onClose={handleCloseModal}
                    title="Título del Modal"
                >
                    <p>Este es el contenido del modal...</p>
                </Modal>
            )}
        </div>
    );
}