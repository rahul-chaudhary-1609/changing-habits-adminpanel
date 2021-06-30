import React, { useState } from 'react'
import { useHistory, useLocation, Redirect } from 'react-router-dom'
import { useFormik } from "formik"
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

    CModalHeader,

} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { verifyOTP, forgetpasswordApi } from '../../../api';
import { OTPvalidation } from '../../../reusable/validations/loginValidations'

const initialValues = {
    otp: "",
    error: ""
}

export default function OtpVerify() {


    const history = useHistory();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const [modal, setModal] = useState(false);

    const onSubmit = async (values, actions) => {
        setLoading(true);
        try {

            const result = await verifyOTP(location.state.email, values.otp);
            setLoading(false);
            if (result) {
                history.push({
                    pathname: '/resetpassword',
                    state: { email: location.state.email, otp: values.otp }
                });
            }

        } catch (error) {
            console.log(error);
            setLoading(false);
            actions.setFieldError('error', error.message);
        }

    }

    const handleResendOtp = async () => {
        try {


            await forgetpasswordApi(location.state.email);
            setModal(!modal);

        } catch (error) {

        }
    }

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema: OTPvalidation
    })



    return (
        location.state ?
            <div className="c-app c-default-layout flex-row align-items-center">
                {/* {alert ?
                    <CAlert color="info" closeButton>
                        OTP send successfully
                    </CAlert> 
                    : null
                } */}
                <CContainer>
                    <CModal
                        show={modal}

                        backdrop={false}

                        color="warning"
                        onClose={setModal}
                    >
                        <CModalHeader closeButton>
                            {/* <CModalTitle>Block User Account?</CModalTitle> */}
                            OTP Send to your Email address
                        </CModalHeader>

                    </CModal>
                    <CRow className="justify-content-center">

                        <CCol md="4">
                            <CCardGroup>

                                <CCard className="p-4">

                                    <CCardBody>
                                        <CForm
                                            onSubmit={formik.handleSubmit}
                                        >
                                            <h1>Verify OTP</h1>
                                            <p className="text-muted">Enter the one time password </p>
                                            <CInputGroup className="mb-3">
                                                <CInputGroupPrepend>
                                                    <CInputGroupText>
                                                        <CIcon name="cil-shield-alt" />
                                                    </CInputGroupText>
                                                </CInputGroupPrepend>
                                                <CInput
                                                    type="text"
                                                    placeholder="OTP"
                                                    maxLength="4"
                                                    id="otp"
                                                    name="otp"
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.otp}
                                                    onChange={formik.handleChange}
                                                />
                                            </CInputGroup>
                                            {formik.touched.otp && formik.errors.otp ? <div className="email-validate">{formik.errors.otp}</div> : null}
                                            {formik.errors.error ? <div className="email-validate">{formik.errors.error}</div> : null}
                                            <CRow>
                                                <CCol xs="6">
                                                    {!loading ? <CButton
                                                        color="primary"
                                                        className="px-4"
                                                        type="submit"
                                                    >
                                                        Submit
                                                </CButton> :
                                                        <div className="spinner-border text-primary" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    }
                                                </CCol>
                                                <CCol xs="6" className="text-right">
                                                    <CButton
                                                        color="link"
                                                        className="px-2"
                                                        onClick={handleResendOtp}
                                                        style={{

                                                            cursor: "pointer", outline: "none",
                                                            boxShadow: "none",


                                                        }}

                                                    >
                                                        Resend OTP
                                                    </CButton>

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
