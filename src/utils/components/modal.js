
import React, { useState } from 'react'
import { CModal, CButton, CModalHeader, CModalFooter, CModalBody, CModalTitle } from '@coreui/react'
import { CustomEditorViewer } from "src/utils/components/customEditor";


export function StatusModal(props) {
    console.log(props)
    return (
        <>
            <CModal
                show={props.modal}
                onClose={props.toggleModal}
                closeOnBackdrop={false}
                backdrop
                centered
                style={{ fontFamily: "Poppins" }}
            //color={props.status == 1 ? "danger" : "success" }
            //color="warning"

            >
                <CModalHeader
                    style={{ height: "3rem", backgroundColor: "teal", color: "white" }}

                    closeButton
                ><CModalTitle>{props.status == 1 ? `Block ${props.info}` : `Unblock ${props.info}`}?</CModalTitle></CModalHeader>
                <CModalBody>
                    Are you sure you want to {props.status == 1 ? "block" : "unblock"} this {props.info}?
                    {props.message ? <div style={{ marginTop: "1rem" }}>{props.message}</div> : null}

                </CModalBody>
                <CModalFooter>
                    <CButton
                        //color="success"
                        style={{ backgroundColor: "#008080", color: "#fff" }}
                        onClick={() => props.toggleStatus(props.toggleData)}
                    >Yes</CButton>
                    <CButton
                        color="danger"
                        onClick={props.toggleModal}
                    >Cancel</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export function DeleteModal(props) {

    return (
        <>
            <CModal
                show={props.modal}
                onClose={props.toggleModal}
                closeOnBackdrop={false}
                backdrop
                centered
                style={{ fontFamily: "Poppins" }}
            //color={props.status == 1 ? "danger" : "success" }
            //color="warning"

            >
                <CModalHeader
                    style={{ height: "3rem", backgroundColor: "teal", color: "white" }}

                    closeButton
                ><CModalTitle>{`Delete ${props.info}`}?</CModalTitle></CModalHeader>
                <CModalBody>
                    Are you sure you want to delete this {props.info}?
                    {props.message ? <div style={{ marginTop: "1rem" }}>{props.message}</div> : null}
                </CModalBody>
                <CModalFooter>
                    <CButton
                        //color="success"
                        style={{ backgroundColor: "#008080", color: "#fff" }}
                        onClick={() => props.deleteQuestion(props.toggleData)}
                    >Yes</CButton>
                    <CButton
                        color="danger"
                        onClick={props.toggleModal}
                    >Cancel</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export function ConfirmNotificationModal(props) {

    return (
        <>
            <CModal
                show={props.modal}
                onClose={props.toggleModal}
                closeOnBackdrop={false}
                backdrop
                centered
                style={{ fontFamily: "Poppins" }}

            >
                <CModalHeader
                    style={{ height: "3rem", backgroundColor: "teal", color: "white" }}

                    closeButton
                ><CModalTitle>{`Confirm ${props.info}`}?</CModalTitle></CModalHeader>
                <CModalBody>
                    <div ><strong>Title: </strong> {props.title}</div>
                    <div style={{ marginTop: "1rem" }}><strong style={{ marginBottom: "1rem" }}>Description: </strong> <CustomEditorViewer description={props.description} minWidth="300px" maxWidth="500px" maxHeight="150px" minHeight="100px" /></div>
                    <div style={{ marginTop: "1rem" }}><strong>Users: </strong>{
                        (props.subscriptionStatus == -1 && props.selectAll) ? "All User" :
                            (props.subscriptionStatus == -1 && !props.selectAll) ?
                                <div style={{ maxHeight: "150px", minHeight: "50px", overflow: "scroll", border: "1px solid rgba(0,0,0,0.2)", padding: "10px", borderRadius: "5px", }}>
                                    {props.user.map((u, index) => {
                                        return <span>{++index}. {u.name} ({u.email})<br /></span>
                                    })}
                                </div> :
                                (props.subscriptionStatus == 0 && props.selectAll) ? "All Free Users" :
                                    (props.subscriptionStatus == 0 && !props.selectAll) ?
                                        <div style={{ maxHeight: "150px", minHeight: "50px", overflow: "scroll", border: "1px solid rgba(0,0,0,0.2)", padding: "10px", borderRadius: "5px", }}>
                                            {props.user.map((u, index) => {
                                                return <span>{++index}. {u.name} ({u.email})<br /></span>
                                            })}
                                        </div> :
                                        (props.subscriptionStatus == 1 && props.selectAll) ? "All Paid Users" :
                                            (props.subscriptionStatus == 1 && !props.selectAll) ?
                                                <div style={{ maxHeight: "150px", minHeight: "50px", overflow: "scroll", border: "1px solid rgba(0,0,0,0.2)", padding: "10px", borderRadius: "5px", }}>
                                                    {props.user.map((u, index) => {
                                                        return <span>{++index}. {u.name} ({u.email})<br /></span>
                                                    })}
                                                </div> : null}</div>
                </CModalBody>
                <CModalFooter>
                    <CButton
                        //color="success"
                        style={{ backgroundColor: "#008080", color: "#fff" }}
                        onClick={props.onYesAction}
                    >Yes</CButton>
                    <CButton
                        color="danger"
                        onClick={props.toggleModal}
                    >Cancel</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}
