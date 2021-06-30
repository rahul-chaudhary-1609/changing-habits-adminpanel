
import React, { useState } from 'react'
import { CModal, CButton, CModalHeader, CModalFooter, CModalBody } from '@coreui/react'


export default function Modal() {
    const [modal, setModal] = useState(false);

    const toggle = () => {
        setModal(!modal);
    }

    return (
        <>
            <CButton
                onClick={toggle}
                className="mr-1"
            >Launch demo modal</CButton>
            <CModal
                show={modal}
                onClose={toggle}
            >
                <CModalHeader closeButton>Modal title</CModalHeader>
                <CModalBody>
                    Lorem ipsum dolor...
          </CModalBody>
                <CModalFooter>
                    <CButton color="primary">Do Something</CButton>{' '}
                    <CButton
                        color="secondary"
                        onClick={toggle}
                    >Cancel</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}
