import React, { useState } from "react";
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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useFormik } from "formik";
import { ChangePasswordValidation } from "../../reusable/validations/loginValidations";
import { ChangePasswordApi } from "../../api";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const initialValues = {
  oldpassword: "",
  newpassword: "",
  confirmpassword: "",
  error: "",
};

export default function ChangePassword() {
  const [showpass, setShowPass] = useState("password");
  const [showpass2, setShowPass2] = useState("password");
  const [showpass3, setShowPass3] = useState("password");

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const auth = useSelector((state) => state.auth);

  const history = useHistory();

  const onSubmit = async (values, actions) => {
    setLoading(true);
    let formData = {};
    formData.old_password = values.oldpassword;
    formData.new_password = values.newpassword;
    formData.confirm_new_password = values.confirmpassword;
    try {
      const result = await ChangePasswordApi(formData);
      if (result) {
        setModal(!modal);
        setLoading(false);
        history.push("/login");
      }
    } catch (error) {
      setLoading(false);
      actions.setFieldError("error", error);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: ChangePasswordValidation,
    onSubmit,
  });

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CModal
          show={modal}
          backdrop={false}
          color="warning"
          onClose={setModal}
        >
          <CModalHeader closeButton>Password Changed Successfully</CModalHeader>
        </CModal>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={formik.handleSubmit}>
                    <h1 style={{ marginBottom: "25px" }}>Change Password</h1>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type={showpass}
                        placeholder="Old Password"
                        autoComplete="current-password"
                        name="oldpassword"
                        onBlur={formik.handleBlur}
                        value={formik.values.oldPassword}
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
                        </CInputGroupText>
                      </CInputGroupAppend>
                    </CInputGroup>
                    {formik.touched.oldpassword && formik.errors.oldpassword ? (
                      <div
                        className="email-validate"
                        style={{ marginTop: "-1.5rem" }}
                      >
                        {formik.errors.oldpassword}
                      </div>
                    ) : null}
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type={showpass2}
                        placeholder="New Password"
                        autoComplete="current-password"
                        name="newpassword"
                        onBlur={formik.handleBlur}
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                      />
                      <CInputGroupAppend>
                        <CInputGroupText
                          onClick={() => {
                            if (showpass2 === "password") {
                              setShowPass2("text");
                            } else {
                              setShowPass2("password");
                            }
                          }}
                        >
                          <FontAwesomeIcon
                            color="blue"
                            size="sm"
                            icon={showpass2 !== "password" ? faEye : faEyeSlash}
                          />{" "}
                        </CInputGroupText>
                      </CInputGroupAppend>
                    </CInputGroup>
                    {formik.touched.newpassword && formik.errors.newpassword ? (
                      <div
                        className="email-validate"
                        style={{ marginTop: "-1.5rem" }}
                      >
                        {formik.errors.newpassword}
                      </div>
                    ) : null}
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type={showpass3}
                        placeholder="confirm new Password"
                        autoComplete="current-password"
                        name="confirmpassword"
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmpassword}
                        onChange={formik.handleChange}
                      />
                      <CInputGroupAppend>
                        <CInputGroupText
                          onClick={() => {
                            if (showpass3 === "password") {
                              setShowPass3("text");
                            } else {
                              setShowPass3("password");
                            }
                          }}
                        >
                          <FontAwesomeIcon
                            color="blue"
                            size="sm"
                            icon={showpass3 !== "password" ? faEye : faEyeSlash}
                          />{" "}
                        </CInputGroupText>
                      </CInputGroupAppend>
                    </CInputGroup>
                    {formik.touched.confirmpassword &&
                    formik.errors.confirmpassword ? (
                      <div
                        className="email-validate"
                        style={{ marginTop: "-1.5rem" }}
                      >
                        {formik.errors.confirmpassword}
                      </div>
                    ) : null}
                    {formik.errors.error ? (
                      <div className="email-validate">
                        {formik.errors.error}
                      </div>
                    ) : null}
                    <CRow>
                      <CCol style={{ marginLeft: "110px" }}>
                        {!loading ? (
                          <CButton
                            className="px-4"
                            style={{
                              backgroundColor: "teal",
                              color: "white",
                              marginRight: "-70px",
                            }}
                            type="submit"
                          >
                            Update
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
                      <CCol>
                        {!loading ? (
                          <CButton
                            color="danger"
                            style={{ width: "5.5rem" }}
                            onClick={() => history.goBack()}
                          >
                            Cancel
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
  );
}
