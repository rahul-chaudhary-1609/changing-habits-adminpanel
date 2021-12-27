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
  CInputGroupAppend,
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import CIcon from "@coreui/icons-react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { store } from "../../../store";

import { loginValidation } from "../../../reusable/validations/loginValidations";

import { signIn } from "../../../api";

const Login = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showpass, setShowPass] = useState("password");

  const history = useHistory();
  const location = useLocation();

  const initialValues = {
    email_phone: sessionStorage.getItem("email_phone")
      ? sessionStorage.getItem("email_phone")
      : location.state && location.state.email_phone
      ? location.state.email_phone
      : null,
    password: sessionStorage.getItem("pass")
      ? sessionStorage.getItem("pass")
      : "",
    error: "",
  };

  const onSubmit = async (values, actions) => {
    try {
      if (values.email_phone) {
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
          if (values.RememberMe) {
            sessionStorage.setItem("email_phone", values.email_phone);
            sessionStorage.setItem("pass", values.password);
          } else {
            sessionStorage.clear();
          }
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
                        placeholder="Email/Phone"
                        autoComplete="email_phone"
                        id="email_phone"
                        name="email_phone"
                        onBlur={formik.handleBlur}
                        value={formik.values.email_phone}
                        onChange={formik.handleChange}
                      />
                    </CInputGroup>
                    {formik.touched.email_phone && formik.errors.email_phone ? (
                      <div className="email-validate">
                        {formik.errors.email_phone}
                      </div>
                    ) : null}
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type={showpass}
                        placeholder="Password"
                        autoComplete="current-password"
                        name="password"
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                      />
                      <CInputGroupAppend>
                        <CInputGroupText
                          onClick={() => {
                            if (showpass === "password") {
                              setShowPass("text");
                            } else {
                              setShowPass("password");
                            }
                          }}
                        >
                          <FontAwesomeIcon
                            color="blue"
                            size="sm"
                            icon={showpass !== "password" ? faEye : faEyeSlash}
                          />{" "}
                          {/* <i className={showpass !== 'password' ? "fa fa-eye" : "fa fa-eye-slash"} /> */}
                        </CInputGroupText>
                      </CInputGroupAppend>
                    </CInputGroup>
                    {formik.touched.password && formik.errors.password ? (
                      <div className="email-validate">
                        {formik.errors.password}
                      </div>
                    ) : null}
                    <CRow>
                      <CCol xs="4">
                        <CInputGroup
                          style={{
                            marginTop: "-8px",
                            paddingBottom: "12px",
                          }}
                        >
                          <CInput
                            type="checkbox"
                            placeholder="Remember Me"
                            name="RememberMe"
                            style={{ fontSize: "4px", marginLeft: "-9px" }}
                            onBlur={formik.handleBlur}
                            value={formik.values.RememberMe}
                            onChange={formik.handleChange}
                          />
                          <p
                            style={{
                              paddingLeft: "5px",
                              fontWeight: "bold",
                            }}
                          >
                            Remember me
                          </p>
                        </CInputGroup>
                      </CCol>
                    </CRow>
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
                            className="px-4"
                            type="submit"
                            style={{ backgroundColor: "teal", color: "white" }}
                            disabled={
                              !formik.values.email_phone ||
                              !formik.values.password
                            }
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
                          <u>Forgot Password?</u>
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
