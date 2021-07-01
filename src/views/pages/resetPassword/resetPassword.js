import React, { useState } from 'react'
import { useHistory, useLocation, Redirect } from 'react-router-dom'
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CRow,
    CModal,
    CInputGroupAppend,
    CModalHeader,

} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useFormik } from "formik"
import { newpasswordValidation } from "../../../reusable/validations/loginValidations";
import { resetPassword } from "../../../api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const initialValues = {
    password: "",
    confirmpassword: ""
}

export default function ResetPassword() {

    const history = useHistory();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [showpass, setShowPass] = useState('password');
    const [showpass2, setShowPass2] = useState('password');

    const onSubmit = async (values, actions) => {

        try {
            setLoading(true)
            const result = await resetPassword(location.state.email, values.password, values.confirmpassword, location.state.otp);
            setLoading(false);
            if (result) {
                setModal(!modal);

                history.push({
                    pathname: '/login',
                    state: { email: location.state.email }
                });
            }

        } catch (error) {
            console.log(error);
            setLoading(false);

            actions.setFieldError('confirmpassword', error.message);
        }

    }


    const formik = useFormik({
        initialValues,
        validationSchema: newpasswordValidation,
        onSubmit

    })


    return (
        location.state ?
            <div className="c-app c-default-layout flex-row align-items-center">
                <CContainer>
                    <CModal
                        show={modal}

                        backdrop={false}

                        color="warning"
                        onClose={setModal}
                    >
                        <CModalHeader closeButton>
                            {/* <CModalTitle>Block User Account?</CModalTitle> */}
                            Password Changed Successfully
                        </CModalHeader>

                    </CModal>
                    <CRow className="justify-content-center">
                        <CCol md="6">
                            <CCardGroup>
                                <CCard className="p-4">
                                    <CCardBody>
                                        <CForm
                                            onSubmit={formik.handleSubmit}
                                        >
                                            <h1>Reset Password</h1>
                                            <p className="text-muted">Enter new Password</p>
                                            <CInputGroup className="mb-4">
                                                <CInputGroupPrepend>
                                                    <CInputGroupText>
                                                        <CIcon name="cil-lock-locked" />
                                                    </CInputGroupText>
                                                </CInputGroupPrepend>
                                                <CInput
                                                    type={showpass}
                                                    placeholder="New Password"
                                                    autoComplete="current-password"
                                                    name="password"
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.password}
                                                    onChange={formik.handleChange}
                                                />
                                                <CInputGroupAppend >
                                                    <CInputGroupText onClick={() => {
                                                        if (showpass === "password") {
                                                            setShowPass('text')
                                                        } else {
                                                            setShowPass('password')
                                                        }
                                                    }}>
                                                        <FontAwesomeIcon
                                                            color="blue"
                                                            size="sm"
                                                            icon={showpass !== 'password' ? faEye : faEyeSlash} />                                                    {/* <i className={showpass !== 'password' ? "fa fa-eye" : "fa fa-eye-slash"} /> */}
                                                    </CInputGroupText>
                                                </CInputGroupAppend>
                                            </CInputGroup>
                                            {formik.touched.password && formik.errors.password ? <div className="email-validate">{formik.errors.password}</div> : null}
                                            <p className="text-muted">Confirm New Password</p>
                                            <CInputGroup className="mb-4">
                                                <CInputGroupPrepend>
                                                    <CInputGroupText>
                                                        <CIcon name="cil-lock-locked" />
                                                    </CInputGroupText>
                                                </CInputGroupPrepend>
                                                <CInput
                                                    type={showpass2}
                                                    placeholder="confirm new Password"
                                                    autoComplete="current-password"
                                                    name="confirmpassword"
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.confirmpassword}
                                                    onChange={formik.handleChange}
                                                />
                                                <CInputGroupAppend >
                                                    <CInputGroupText onClick={() => {
                                                        if (showpass2 === "password") {
                                                            setShowPass2('text')
                                                        } else {
                                                            setShowPass2('password')
                                                        }
                                                    }}>
                                                        <FontAwesomeIcon
                                                            color="blue"
                                                            size="sm"
                                                            icon={showpass2 !== 'password' ? faEye : faEyeSlash} />                                                    {/* <i className={showpass !== 'password' ? "fa fa-eye" : "fa fa-eye-slash"} /> */}
                                                    </CInputGroupText>
                                                </CInputGroupAppend>
                                            </CInputGroup>
                                            {formik.touched.confirmpassword && formik.errors.confirmpassword ? <div className="email-validate">{formik.errors.confirmpassword}</div> : null}
                                            <CRow>
                                                <CCol xs="6">
                                                    {!loading ?
                                                        <CButton
                                                            color="primary"
                                                            className="px-4"
                                                            type="submit"
                                                        >
                                                            Reset
                                                    </CButton> :
                                                        <div className="spinner-border text-primary" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>}
                                                </CCol>
                                            </CRow>
                                        </CForm>
                                    </CCardBody>
                                </CCard>
                            </CCardGroup>
                        </CCol>
                    </CRow>
                </CContainer>
            </div> : <Redirect to="/login" />
    )
}
