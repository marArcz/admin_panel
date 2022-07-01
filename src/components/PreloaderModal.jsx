import React from 'react'
import { Modal, Spinner } from 'react-bootstrap'

const PreloaderModal = ({ show, onClose }) => {
    return (
        <Modal show={show} size="sm" onHide={onClose} backdrop="static" keyboard={false}>
            <Modal.Body  className='bg-dark'>
                <div className="text-center text-light">
                    <p className="fs-6">Just a moment, please wait...</p>
                    <Spinner animation="border" size="sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default PreloaderModal