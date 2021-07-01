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
} from "@coreui/react";
import { useFormik } from "formik";
import {
  EditUserDetails,
  addUserList,
  ViewUserDetails,
  uploadImage,
} from "../../api";
import { useHistory, useParams } from "react-router-dom";
import { UserValidation } from "../../reusable/validations/loginValidations";
import DefaultUser from "../../assets/svgs/defaultUser";

export default function EditUser(props) {
  const history = useHistory();
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const [userDetails, setUserDetails] = useState({});
  const [imageUrl, setImageUrl] = useState(null);

  const initialValues = {
    name: userDetails.name ? userDetails.name : "",
    email: userDetails.email ? userDetails.email : "",
    country_code: userDetails.country_code ? userDetails.country_code : "",
    phone_no: userDetails.phone_no ? userDetails.phone_no : "",
    profile_picture_url: userDetails.profile_picture_url
      ? userDetails.profile_picture_url
      : "",
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const res = await ViewUserDetails(params.id);
      if (res.status == 200) {
        setUserDetails(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileChange = async (e) => {
    var image = e.currentTarget.files[0];
    var data = new FormData();
    data.append("image", image, image.name);
    data.append("folderName", "user");

    try {
      const res = await uploadImage(data);
      if (res.status == 200) {
        debugger;
        setImageUrl(res.image_url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (values) => {
    try {
      if (userDetails.name) {
        let formData = {};
        if (values.name != userDetails.name) formData.name = values.name;
        if (values.email != userDetails.email) formData.email = values.email;
        if (values.phone_no != userDetails.phone_no)
          formData.phone_no = values.phone_no;
        if (imageUrl) formData.profile_picture_url = imageUrl;
        setLoading(true);
        const response = await EditUserDetails(formData, Number(params.id));
        setLoading(false);
        if (response) {
          history.push("/users");
        }
      } else {
        setLoading(true);
        const response = await addUserList(values);
        setLoading(false);
        if (response) {
          history.push("/users");
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit,
    validationSchema: UserValidation,
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
                    <div style={{ textAlign: "center" }}>
                      <label for="upload">
                        <div
                          class="w-full px-2 py-1 my-2 flex justify-around items-center bg-gray-400 rounded-lg text-white"
                          title="Upload a photo..."
                        >
                          <svg
                            style={{ width: "20px" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            ></path>
                          </svg>{" "}
                          Upload
                          <CInput
                            type="file"
                            name="upload"
                            id="upload"
                            onChange={handleProfileChange}
                            style={{ display: "none" }}
                            accept="image/png,image/jpeg"
                          />
                        </div>
                      </label>
                    </div>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="hf-categorytype">
                      <h6>Enter User Name</h6>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
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
                    <CLabel htmlFor="hf-categorytype">
                      <h6>Enter Email</h6>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="email"
                      name="email"
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
                      <h6>Enter Mobile Number</h6>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="phone_no"
                      name="phone_no"
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
                      style={{ width: "5rem" }}
                      color="success"
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
                    onClick={() => history.goBack()}
                  >
                    <strong>Cancel</strong>
                  </CButton>
                </CCardFooter>
              </CForm>
            </CCardBody>
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
                  <CCol xs="12" md="9">
                    <DefaultUser style={{ marginBottom: "2rem" }} />
                    <CInputFile
                      id="profile_picture_url"
                      name="profile_picture_url"
                      type="file"
                      accept="image/x-png,image/gif,image/jpeg"
                      onChange={formik.handleChange}
                    />
                    {formik.errors.profile_picture_url ? (
                      <div className="email-validate">
                        {formik.errors.profile_picture_url}
                      </div>
                    ) : null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="hf-categorytype">
                      <h6>Enter User Name</h6>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="name"
                      name="name"
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.categoryType &&
                    formik.errors.categoryType ? (
                      <div className="email-validate">
                        {formik.errors.categoryType}
                      </div>
                    ) : null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="hf-categorytype">
                      <h6>Enter Email</h6>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="email"
                      name="email"
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
                      <h6>Enter Mobile Number</h6>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="country_code"
                      name="country_code"
                      onBlur={formik.handleBlur}
                      value={formik.values.country_code}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.country_code &&
                    formik.errors.country_code ? (
                      <div className="email-validate">
                        {formik.errors.country_code}
                      </div>
                    ) : null}
                    <CInput
                      type="text"
                      id="phone_no"
                      name="phone_no"
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
                {/* <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="hf-categorytype">
                      <h6>User in Free Trail?</h6>
                    </CLabel>
                  </CCol>
                  <CCol row md="3">
                    <CInput
                      type="radio"
                      id="trail"
                      name="yesno"
                      style={{
                        width: "15%",
                        marginTop: "-7px",
                        outline: "none !important",
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.trail}
                      onChange={formik.handleChange}
                    />
                    <label for="trail1">Yes</label>
                  </CCol>
                  <CCol row md="3">
                    <CInput
                      type="radio"
                      id="trail"
                      name="yesno"
                      style={{ width: "15%", marginTop: "-7px" }}
                      onBlur={formik.handleBlur}
                      value={formik.values.trail}
                      onChange={formik.handleChange}
                    />
                    <label for="trail2">No</label>
                    {formik.touched.categoryType &&
                    formik.errors.categoryType ? (
                      <div className="email-validate">
                        {formik.errors.categoryType}
                      </div>
                    ) : null}
                  </CCol>
                </CFormGroup> */}
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
                      style={{ width: "5rem" }}
                      color="success"
                    >
                      {userDetails.name ? (
                        <strong>Update</strong>
                      ) : (
                        <strong>Add</strong>
                      )}
                    </CButton>
                  )}

                  <CButton
                    style={{ width: "5rem" }}
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
