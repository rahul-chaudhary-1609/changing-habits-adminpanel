
import React, { useState } from 'react'
import { CModal, CButton, CModalHeader, CModalFooter, CModalBody,CModalTitle } from '@coreui/react'


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
                color="warning"
                
            >
                <CModalHeader
                    style={{height:"3rem"}}
                    closeButton
                ><CModalTitle>{props.status==1?`Block ${props.info}`:`Unblock ${props.info}`}</CModalTitle></CModalHeader>
                <CModalBody>
                    Are you sure you want to {props.status == 1 ? "block" : "unblock"} this { props.info}?
          </CModalBody>
                <CModalFooter>
                    <CButton
                        color="success"
                        //style={{backgroundColor:"#008080",color:"#fff"}}
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
