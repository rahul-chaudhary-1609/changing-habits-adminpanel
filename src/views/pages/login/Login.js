import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";

import { loginValidation } from "../../../reusable/validations/loginValidations";

import { signIn } from "../../../api";

const Login = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const history = useHistory();
  const location = useLocation();

  const initialValues = {
    email: location.state && location.state.email ? location.state.email : null,
    phone: location.state && location.state.phone ? location.state.phone : null,
    password: "",
    error: "",
  };

  const onSubmit = async (values, actions) => {
    try {
      if (values.email || values.phone) {
        setLoading(true);
        const res = await signIn(values);

        if (res.success) {
          await dispatch({
            type: "SIGN_IN",
            payload: res,
          });
          setLoading(false);
          setMessage(null);
          history.push("/users");
        }
      } else setMessage("Please enter Email or Phone Number");
    } catch (error) {
      setLoading(false);
      actions.setFieldError("error", error);
      console.log(error);
    }
  };

  function handleForgotPassword() {
    history.push("/forgetpassword");
  }

  const formik = useFormik({
    initialValues,
    validationSchema: loginValidation,
    onSubmit,
  });

  useEffect(() => localStorage.clear(), []);

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CModal
          show={location.state && location.state.email}
          backdrop={false}
          size="sm"
          color="warning"
        >
          <CModalHeader closeButton>Password Changed Successfully</CModalHeader>
        </CModal>
        <CRow className="justify-content-center">
          <CCol md="6">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={formik.handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="text"
                        placeholder="Email address"
                        autoComplete="email"
                        id="email"
                        name="email"
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                      />
                    </CInputGroup>
                    {formik.touched.email && formik.errors.email ? (
                      <div className="email-validate">
                        {formik.errors.email}
                      </div>
                    ) : null}
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-phone" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="text"
                        placeholder="Phone"
                        autoComplete="phone"
                        id="phone"
                        name="phone"
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        name="password"
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                      />
                    </CInputGroup>
                    {formik.touched.password && formik.errors.password ? (
                      <div className="email-validate">
                        {formik.errors.password}
                      </div>
                    ) : null}
                    {formik.errors.error ? (
                      <div className="email-validate">
                        {formik.errors.error}
                      </div>
                    ) : null}
                    {message ? (
                      <div className="email-validate">{message}</div>
                    ) : null}
                    <CRow>
                      <CCol xs="6">
                        {!loading ? (
                          <CButton
                            color="primary"
                            className="px-4"
                            type="submit"
                          >
                            Login
                          </CButton>
                        ) : (
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        )}
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton
                          color="link"
                          className="px-0"
                          onClick={() => handleForgotPassword()}
                        >
                          Forgot Password?
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
    </div>
  );
};

export default Login;
