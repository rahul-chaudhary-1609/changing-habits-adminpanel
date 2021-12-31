import React, { useState, useEffect } from "react";
import FormData from "form-data";
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
  CImg,
  CInputFile,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CLink,
} from "@coreui/react";
import { useFormik } from "formik";
import {
  EditUserDetails,
  addUserList,
  ViewUserDetails,
  uploadImage,
  upgradeAppAccess,
} from "../../api";
import { useHistory, useParams } from "react-router-dom";
import { UserValidation } from "../../reusable/validations/loginValidations";
import DefaultUser from "../../assets/svgs/defaultUser";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

export default function EditUser(props) {
  const history = useHistory();
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const [userDetails, setUserDetails] = useState({});
  const [showError, setShowError] = useState(null);
  const [msgError, setMsgError] = useState(null);
  const [image, setImage] = useState({});
  const [subscriptionStatus, setSubscriptionStatus] = useState(0);
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  const [code, setCode] = useState("+1");

  const initialValues = {
    name: userDetails.name ? userDetails.name : "",
    email: userDetails.email ? userDetails.email : "",
    country_code: userDetails.country_code ? userDetails.country_code : "",
    phone_no: userDetails.phone_no ? userDetails.phone_no : "",
    profile_picture_url: userDetails.profile_picture_url
      ? userDetails.profile_picture_url
      : "",
    subscription_status: userDetails.subscription_status
      ? userDetails.subscription_status
      : "",
    subscription_token_id: userDetails.subscription_token_id
      ? userDetails.subscription_token_id
      : "",
  };

  const formdata = new FormData();

  useEffect(() => {
    if (params.id) {
      getUserDetails();
      setSuccessMsg(null);
    }
  }, [refresh]);

  const getUserDetails = async () => {
    try {
      const res = await ViewUserDetails(params.id);
      if (res.status == 200) {
        setUserDetails(res);
        setCode(userDetails.country_code);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileChange = async (image) => {
    setImage(image);
  };

  const handleSubscriptionStatus = (type) => {
    setSubscriptionStatus(type);
  };

  const handleUpgradeSubscription = async () => {
    try {
      if (tokenId) {
        const res = await upgradeAppAccess(tokenId, params.id);
        if (res) {
          setSuccessMsg("Subscription upgraded successfully");
          setUpgradeModal(!upgradeModal);
          setRefresh(!refresh);
          setTokenError(null);
        }
      } else setTokenError("Token Id is required");
    } catch (error) {}
  };

  const onSubmit = async (values, actions) => {
    try {
      let bodyFormData = {};
      setMsgError(null);
      if (image.type) {
        formdata.append("image", image, image.name);
        formdata.append("folderName", "user");
        const res = await uploadImage(formdata);
        if (res.status == 200) {
          bodyFormData.profile_picture_url = res.data.image_url;
        }
      }
      bodyFormData.name = values.name;

      if (params.id) {
        if (values.email != userDetails.email) {
          bodyFormData.email = values.email;
        }
        if (values.phone_no != userDetails.phone_no) {
          bodyFormData.phone_no = values.phone_no;
        }
        if (code != userDetails.country_code) {
          bodyFormData.country_code = code;
        }
        setLoading(true);
        const response = await EditUserDetails(bodyFormData, Number(params.id));
        setLoading(false);
        if (response) {
          setShowError(null);
          history.push("/users");
        }
      } else {
        bodyFormData.email = values.email;
        bodyFormData.country_code = code;
        bodyFormData.phone_no = values.phone_no;
        bodyFormData.subscription_status = subscriptionStatus;
        if (values.subscription_token_id) {
          bodyFormData.subscription_token_id = values.subscription_token_id;
        }
        setLoading(true);
        const response = await addUserList(bodyFormData);
        setLoading(false);
        if (response) {
          history.push("/users");
        }
      }
    } catch (error) {
      setLoading(false);
      actions.setFieldError("error", error.message);
      setMsgError(error.message);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit,
    validationSchema: UserValidation(subscriptionStatus),
  });

  return (
    <CContainer
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CCol xs="12" md="6">
        {successMsg && (
          <div
            style={{
              backgroundColor: "#9ACD32",
              padding: "10px",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "24px",
              width: "fit-content",
            }}
          >
            {successMsg}
          </div>
        )}
        <CModal
          show={upgradeModal}
          centered={true}
          backdrop={false}
          onClose={setUpgradeModal}
          style={{ fontFamily: "Poppins" }}
        >
          <CModalHeader
            style={{ backgroundColor: "teal", color: "white" }}
            closeButton
          >
            <CModalTitle>Upgrade To Paid Subscription</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CFormGroup row>
              <CCol md="3">
                <CLabel htmlFor="hf-categorytype">
                  <h6>subscription token id:</h6>
                </CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput
                  type="text"
                  autoComplete="off"
                  id="subscription_token_id"
                  name="subscription_token_id"
                  onChange={(e) => {
                    setTokenId(e.target.value);
                  }}
                />
              </CCol>
              {tokenError ? (
                <div className="email-validate" style={{ marginLeft: "1rem" }}>
                  {tokenError}
                </div>
              ) : null}
            </CFormGroup>
          </CModalBody>
          <CModalFooter>
            <CButton
              style={{ backgroundColor: "teal", color: "white" }}
              onClick={handleUpgradeSubscription}
            >
              Yes
            </CButton>
          </CModalFooter>
        </CModal>
        {params.id ? (
          <CCard>
            <CCardHeader style={{ fontFamily: "Lato" }}>
              <h3>
                <strong>Edit User Details</strong>
              </h3>
            </CCardHeader>
            <CCardBody style={{ fontFamily: "Roboto" }}>
              <CForm onSubmit={formik.handleSubmit} className="form-horizontal">
                <CFormGroup row>
                  <CCol xs="12" style={{ textAlign: "center" }}>
                    {userDetails.profile_picture_url ? (
                      <>
                        <CImg
                          src={userDetails.profile_picture_url}
                          className="c-avatar-img"
                          alt="admin@bootstrapmaster.com"
                          style={{
                            marginBottom: "2rem",
                            width: "6rem",
                            height: "6rem",
                          }}
                        />
                        <br />
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          Profile Picture
                        </span>
                      </>
                    ) : (
                      <DefaultUser style={{ marginBottom: "2rem" }} />
                    )}
                    <div style={{ marginLeft: "140px" }}>
                      <CInputFile
                        name="profile_picture_url"
                        type="file"
                        className="hidden"
                        accept=".png, .jpg"
                        onChange={(e) => {
                          formik.setFieldValue("profile_picture_url", "");

                          if (
                            e.target.files[0].type !== "image/png" &&
                            e.target.files[0].type !== "image/jpeg"
                          ) {
                            setShowError("Only jpeg, png images are allowed");
                            return;
                          }
                          setShowError(null);
                          handleProfileChange(e.target.files[0]);
                        }}
                      />
                      {showError ? (
                        <div className="email-validate">{showError}</div>
                      ) : null}
                    </div>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="hf-categorytype">
                      <h6>User Name</h6>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="name"
                      name="name"
                      autoComplete="off"
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
                    <CLabel htmlFor="hf-categorytype">
                      <h6>Email</h6>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="email"
                      name="email"
                      autoComplete="off"
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="email-validate">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="hf-categorytype">
                      <h6>Mobile Number</h6>
                    </CLabel>
                  </CCol>
                  <CCol md="4">
                    <PhoneInput
                      id="country_code"
                      name="country_code"
                      international
                      value={userDetails.country_code}
                      onChange={setCode}
                      inputProps={{
                        name: "phone_no",
                        autoFocus: true,
                      }}
                    />
                  </CCol>
                  <CCol md="5">
                    <CInput
                      type="text"
                      id="phone_no"
                      name="phone_no"
                      autoComplete="off"
                      onBlur={formik.handleBlur}
                      value={formik.values.phone_no}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.phone_no && formik.errors.phone_no ? (
                      <div className="email-validate">
                        {formik.errors.phone_no}
                      </div>
                    ) : null}
                  </CCol>
                </CFormGroup>
                {userDetails.subscription_status ? (
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="hf-categorytype">
                        <h6>Subscription token Id</h6>
                      </CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput
                        type="text"
                        id="subscription_token_id"
                        name="subscription_token_id"
                        autoComplete="off"
                        disabled="true"
                        onBlur={formik.handleBlur}
                        value={formik.values.subscription_token_id}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.subscription_token_id &&
                      formik.errors.subscription_token_id ? (
                        <div className="email-validate">
                          {formik.errors.subscription_token_id}
                        </div>
                      ) : null}
                    </CCol>
                  </CFormGroup>
                ) : (
                  ""
                )}
                <CCardFooter
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  {loading ? (
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <CButton
                      type="submit"
                      className="teal"
                      style={{ width: "5rem", marginRight: "-105px" }}
                    >
                      {params.id ? (
                        <strong>Update</strong>
                      ) : (
                        <strong>Add</strong>
                      )}
                    </CButton>
                  )}

                  <CButton
                    style={{ width: "5rem" }}
                    color="danger"
                    onClick={() => history.push("/users")}
                  >
                    <strong>Cancel</strong>
                  </CButton>
                </CCardFooter>
              </CForm>
            </CCardBody>
            <CCardFooter
              style={{
                borderTop: "0px",
                marginBottom: "15px",
                paddingTop: "0px",
              }}
            >
              {userDetails.subscription_status == 0 ? (
                <CCol
                  style={{
                    textAlign: "center",
                    cursor: "pointer",
                    paddingBottom: "10px",
                  }}
                  onClick={() => setTokenError(null)}
                >
                  <CLink onClick={() => setUpgradeModal(!upgradeModal)}>
                    <u>
                      <strong>Upgrade Subscription ?</strong>
                    </u>
                  </CLink>
                </CCol>
              ) : (
                ""
              )}
              <CCol
                style={{
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <CLink
                  onClick={() =>
                    history.push(`/editUser/${params.id}/changePassword`)
                  }
                >
                  <u>
                    <strong>Change User Password ?</strong>
                  </u>
                </CLink>
              </CCol>
            </CCardFooter>
          </CCard>
        ) : (
          <CCard>
            <CCardHeader style={{ fontFamily: "Lato" }}>
              <h3>
                <strong>Add User Details</strong>
              </h3>
            </CCardHeader>
            <CCardBody style={{ fontFamily: "Roboto" }}>
              <CForm onSubmit={formik.handleSubmit} className="form-horizontal">
                <CFormGroup row>
                  <CCol>
                    <DefaultUser
                      style={{ marginBottom: "2rem", marginLeft: "168px" }}
                    />
                    <div style={{ marginLeft: "150px" }}>
                      <CInputFile
                        name="profile_picture_url"
                        type="file"
                        accept=".png, .jpg"
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
                          setShowError(null);
                          handleProfileChange(e.target.files[0]);
                        }}
                      />
                      {showError ? (
                        <div className="email-validate">{showError}</div>
                      ) : null}
                    </div>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="hf-categorytype">
                      <h6>User Name</h6>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="name"
                      name="name"
                      autoComplete="off"
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
                    <CLabel htmlFor="hf-categorytype">
                      <h6>Email</h6>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="email"
                      name="email"
                      autoComplete="off"
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="email-validate">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="hf-categorytype">
                      <h6>Mobile Number</h6>
                    </CLabel>
                  </CCol>
                  <CCol md="3">
                    <PhoneInput
                      defaultCountry="US"
                      id="country_code"
                      name="country_code"
                      international
                      value={code}
                      onChange={setCode}
                      inputProps={{
                        name: "phone_no",
                        autoFocus: true,
                      }}
                    />
                    {formik.touched.country_code &&
                    formik.errors.country_code ? (
                      <div
                        style={{
                          width: "max-content",
                          color: "red",
                          marginTop: "15px",
                        }}
                      >
                        {formik.errors.country_code}
                      </div>
                    ) : null}
                  </CCol>
                  <CCol md="6">
                    <CInput
                      type="text"
                      id="phone_no"
                      name="phone_no"
                      autoComplete="off"
                      onBlur={formik.handleBlur}
                      value={formik.values.phone_no}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.phone_no && formik.errors.phone_no ? (
                      <div className="email-validate">
                        {formik.errors.phone_no}
                      </div>
                    ) : null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="recipe_type">
                      <h6>Subscription Status?</h6>
                    </CLabel>
                  </CCol>
                  <CCol row md="4">
                    <label for={0}>
                      <CInput
                        type="radio"
                        id={0}
                        formControlName="recipe_type"
                        autoComplete="off"
                        checked={subscriptionStatus == 0 ? "checked" : ""}
                        style={{
                          width: "20%",
                          marginTop: "-7px",
                          outline: "none !important",
                          cursor: "pointer",
                        }}
                        onChange={() => {
                          handleSubscriptionStatus(0);
                        }}
                      />
                      Free Trial
                    </label>
                  </CCol>
                  <CCol row md="4">
                    <label for={1}>
                      <CInput
                        type="radio"
                        id={1}
                        autoComplete="off"
                        formControlName="recipe_type"
                        checked={subscriptionStatus == 1 ? "checked" : ""}
                        style={{
                          width: "10%",
                          marginTop: "-7px",
                          cursor: "pointer",
                        }}
                        onChange={() => {
                          handleSubscriptionStatus(1);
                        }}
                      />
                      Paid Subscription
                    </label>
                  </CCol>
                </CFormGroup>
                {subscriptionStatus == 1 ? (
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="hf-categorytype">
                        <h6>Subscription Token Id</h6>
                      </CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput
                        type="text"
                        id="subscription_token_id"
                        name="subscription_token_id"
                        autoComplete="off"
                        onBlur={formik.handleBlur}
                        value={formik.values.subscription_token_id}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.subscription_token_id &&
                      formik.errors.subscription_token_id ? (
                        <div className="email-validate">
                          {formik.errors.subscription_token_id}
                        </div>
                      ) : null}
                    </CCol>
                  </CFormGroup>
                ) : (
                  ""
                )}
                {msgError ? (
                  <div className="email-validate">{msgError}</div>
                ) : null}
                <CCardFooter
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  {loading ? (
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <CButton
                      type="submit"
                      style={{
                        width: "5rem",
                        backgroundColor: "teal",
                        color: "white",
                        marginLeft: "50px",
                      }}
                    >
                      {userDetails.name ? (
                        <strong>Update</strong>
                      ) : (
                        <strong>Add</strong>
                      )}
                    </CButton>
                  )}

                  <CButton
                    style={{ width: "5rem", marginRight: "55px" }}
                    color="danger"
                    onClick={() => history.goBack()}
                  >
                    <strong>Cancel</strong>
                  </CButton>
                </CCardFooter>
              </CForm>
            </CCardBody>
          </CCard>
        )}
      </CCol>
    </CContainer>
  );
}
