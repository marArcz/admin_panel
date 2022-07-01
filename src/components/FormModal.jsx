import React from 'react'
import { Modal, Button } from 'react-bootstrap';

const FormModal = ({ title, children, show, handleClose,size }) => {
    return (
        <Modal show={show} onHide={handleClose} size={size}>
            <Modal.Header closeButton className="bg-light text-dark">
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-light text-dark">
                {children}
            </Modal.Body>
        </Modal>
    )
}

export default FormModal