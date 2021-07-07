import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CInputFile,
  CTextarea,
  CModal,
  CModalHeader,
  CModalFooter,
  CModalBody,
  CModalTitle,
  CImg,
} from "@coreui/react";

import { useFormik } from "formik";
import { UpdateProfile, uploadImage } from "../../api";
import { useLocation, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { updateEmail } from "../../reusable/validations/loginValidations";
import DefaultUser from "../../assets/svgs/defaultUser";

export default function EditAdmin() {
  const location = useLocation();
  const history = useHistory();
  if (!location.state) {
    history.push("/profile");
  }

  const userId = useSelector((state) => state.auth.userId);
  const update = useSelector((state) => state.sidebar.updatePic);
  const [emailModal, setEmailModal] = useState(false);
  const [phoneModal, setPhoneModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState("");
  const [image, setImage] = useState({});

  console.log("location", location.state);

  const formdata = new FormData();

  const initialValues = {
    name: location.state ? location.state.data.name : "",
    email: location.state ? location.state.data.email : "",
    profile_picture_url: location.state
      ? location.state.data.profile_picture_url
      : "",
    newemail: location.state ? location.state.data.email : "",
    phone:
      location.state && location.state.data.phone_no
        ? location.state.data.phone_no
        : "",
    newPhone:
      location.state && location.state.data.phoneNumber
        ? location.state.data.phoneNumber
        : "",
  };

  const handleProfileChange = async (image) => {
    setImage(image);
  };

  const onSubmit = async (values) => {
    let bodyFormData = {};

    if (image.type) {
      formdata.append("image", image, image.name);
      formdata.append("folderName", "user");
      const res = await uploadImage(formdata);
      if (res.status == 200) {
        bodyFormData.profile_picture_url = res.data.image_url;
      }
    }

    bodyFormData.name = values.name;
    try {
      setLoading(true);
      const response = await UpdateProfile(bodyFormData);

      update();

      setLoading(false);

      history.push({
        pathname: `/profile`,
        state: { data: response.message, type: "edit" },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit,
    // validationSchema: updateEmail,
  });

  const handleUpadteEmail = async (type) => {
    setEmailModal(!emailModal);
  };

  return (
    <CContainer
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CCol lg="8" md="6">
        <CModal
          show={emailModal}
          centered={true}
          backdrop={false}
          color="warning"
          onClose={setEmailModal}
          style={{ fontFamily: "Poppins" }}
        >
          <CModalHeader closeButton>
            <CModalTitle>Enter New Email Address</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CFormGroup row>
              <CCol md="3">
                <CLabel htmlFor="hf-categorytype">
                  <h6>New Email:</h6>
                </CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput
                  type="text"
                  id="newemail"
                  name="newemail"
                  onBlur={formik.handleBlur}
                  value={formik.values.newemail}
                  onChange={formik.handleChange}
                />
                {formik.touched.newemail && formik.errors.newemail ? (
                  <div className="email-validate">{formik.errors.newemail}</div>
                ) : null}
              </CCol>
            </CFormGroup>
          </CModalBody>
          <CModalFooter>
            <CButton color="success" onClick={() => handleUpadteEmail("email")}>
              Yes
            </CButton>
            <CButton color="secondary" onClick={() => setEmailModal(false)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
        <CModal
          show={phoneModal}
          centered={true}
          backdrop={false}
          color="warning"
          onClose={setPhoneModal}
          style={{ fontFamily: "Poppins" }}
        >
          <CModalHeader closeButton>
            <CModalTitle>Enter New Phone Number</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CFormGroup row>
              <CCol md="3">
                <CLabel htmlFor="hf-categorytype">
                  <h6>New Phone:</h6>
                </CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput
                  type="text"
                  id="newPhone"
                  name="newPhone"
                  onBlur={formik.handleBlur}
                  value={formik.values.newPhone}
                  onChange={formik.handleChange}
                />
                {formik.touched.newPhone && formik.errors.newPhone ? (
                  <div className="email-validate">{formik.errors.newPhone}</div>
                ) : null}
              </CCol>
            </CFormGroup>
          </CModalBody>
          <CModalFooter>
            <CButton color="success" onClick={() => handleUpadteEmail("phone")}>
              Yes
            </CButton>
            <CButton color="secondary" onClick={() => setPhoneModal(false)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
        <CCard>
          <CCardHeader style={{ fontFamily: "Lato" }}>
            <h3>
              <strong>Edit Admin</strong>
            </h3>
          </CCardHeader>
          <CCardBody style={{ fontFamily: "Poppins" }}>
            <CForm onSubmit={formik.handleSubmit} className="form-horizontal">
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="custom-file-input">
                    Update Profile Pic
                  </CLabel>
                </CCol>
                <CCol xs="8" md="6">
                  {initialValues.profile_picture_url ? (
                    <>
                      <CImg
                        src={initialValues.profile_picture_url}
                        className="c-avatar-img"
                        alt=""
                        style={{
                          marginBottom: "2rem",
                          width: "6rem",
                          height: "6rem",
                          paddingBottom: "10px",
                          cursor: "pointer",
                        }}
                      />
                    </>
                  ) : (
                    <DefaultUser style={{ marginBottom: "2rem" }} />
                  )}
                  <CInputFile
                    name="profile_picture_url"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      formik.setFieldValue("profile_picture_url", "");

                      if (
                        e.target.files[0].type !== "image/png" &&
                        e.target.files[0].type !== "image/jpeg"
                      ) {
                        setShowError("Only jpeg, png images are allowed");
                        return;
                      }
                      setShowError("");
                      handleProfileChange(e.target.files[0]);
                    }}
                  />
                  {showError ? (
                    <div className="email-validate">{showError}</div>
                  ) : null}
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="hf-category">Admin Name</CLabel>
                </CCol>
                <CCol>
                  <CInput
                    type="text"
                    id="name"
                    name="name"
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="email-validate">{formik.errors.name}</div>
                  ) : null}
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="hf-categorytype">Email Address</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput
                    type="text"
                    id="email"
                    disabled="true"
                    name="email"
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {/* <CButton
                    onClick={() => setEmailModal(!emailModal)}
                    style={{ color: "white", marginTop: "1rem", width: "8rem" }}
                    color="warning"
                  >
                    Update Email
                  </CButton> */}
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="hf-categorytype">Phone Number</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput
                    id="phone"
                    disabled="true"
                    name="phone"
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                  />
                  {/* <CButton
                    onClick={() => setPhoneModal(!phoneModal)}
                    style={{ color: "white", marginTop: "1rem", width: "8rem" }}
                    color="warning"
                  >
                    Update Phone
                  </CButton> */}
                </CCol>
              </CFormGroup>
              <CCardFooter
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <CButton
                  onClick={() => history.push("/profile")}
                  style={{ width: "5rem" }}
                  type="reset"
                  color="danger"
                >
                  <strong>Cancel</strong>
                </CButton>
                {loading ? (
                  <div className="spinner-border text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <CButton
                    type="submit"
                    color="success"
                    style={{ width: "5rem" }}
                  >
                    <strong>Update</strong>
                  </CButton>
                )}
              </CCardFooter>
              <CCardFooter>
                <CCol style={{ textAlign: "center", margin: "10px" }}>
                  <CButton
                    color="primary"
                    onClick={() => history.push("/changePassword")}
                  >
                    <strong>Change Password</strong>
                  </CButton>
                </CCol>
              </CCardFooter>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CContainer>
  );
}
