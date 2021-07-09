
import React, { useState } from 'react'
import { CModal, CButton, CModalHeader, CModalFooter, CModalBody } from '@coreui/react'


export default function StatusModal(props) {

    return (
        <>
            <CModal
                show={props.modal}
                onClose={props.toggleModal}
                closeOnBackdrop={false}
                backdrop
                centered
                //color={props.status == 1 ? "danger" : "success" }
                
            >
                <CModalHeader
                    style={{backgroundColor:"#008080",color:"#fff"}}
                    closeButton
                ><strong>{props.status==1?"Block Learning Content":"Unblock Learning Content"}</strong></CModalHeader>
                <CModalBody>
                    Are you sure you want to {props.status == 1 ? "block" : "unblock"} this { props.info}?
          </CModalBody>
                <CModalFooter>
                    <CButton
                        style={{backgroundColor:"#008080",color:"#fff"}}
                        onClick={()=>props.toggleStatus(props.toggleData)}
                    >Yes</CButton>
                    <CButton
                        color="secondary"
                        onClick={props.toggleModal}
                    >Cancel</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}
