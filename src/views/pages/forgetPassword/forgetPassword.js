import React, { useState } from "react";
import { useHistory } from "react-router-dom";
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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useFormik } from "formik";
import { forgetpasswordApi } from "../../../api";

import { forgetpasswordValidation } from "../../../reusable/validations/loginValidations";

const initialValues = {
  email: "",
  error: "",
};

export default function Forgetpassword() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState();

  const onSubmit = async (values, actions) => {
    setLoading(true);
    try {
      const result = await forgetpasswordApi(values.email);
      if (result) {
        setLoading(false);
        setToast(
          "Password reset link has been sent to your registered email id"
        );
        setTimeout(() => {
          history.push("/login");
        }, 1500);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      actions.setFieldError("error", error);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: forgetpasswordValidation,
    onSubmit,
  });

  return (
    <>
      {toast && (
        <div
          style={{
            backgroundColor: "#9ACD32",
            padding: "10px",
            width: "fit-content",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "12px",
          }}
        >
          {toast}
        </div>
      )}
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="6">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm onSubmit={formik.handleSubmit}>
                      <h1>Forgot Password</h1>
                      <p className="text-muted">
                        Enter your registered email address
                      </p>
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
                      {formik.errors.error ? (
                        <div className="email-validate">
                          {formik.errors.error}
                        </div>
                      ) : null}
                      <CRow>
                        <CCol xs="6">
                          {!loading ? (
                            <CButton
                              className="px-4"
                              type="submit"
                              style={{
                                backgroundColor: "teal",
                                color: "white",
                              }}
                            >
                              Submit
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
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  );
}
