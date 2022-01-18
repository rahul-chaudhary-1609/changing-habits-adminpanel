import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import Select from "react-select";
import { upload } from "../../data/upload";
import {
  CCardBody,
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
  CButton,
  CSelect,
  CInputFile,
  CSpinner,
  CModal,
  CImg,
  CModalHeader,
  CModalFooter,
  CModalBody,
  CModalTitle,
} from "@coreui/react";
import {
  getFoodLogCategory,
  addFoodLogCategory,
  editFoodLogCategory,
  getCategoryLogo,
  addCategoryLogo,
} from "../../data/foodLogManagement";
import { phaseList } from "../../utils/helper";

function AddEditFoodLogCategory() {
  let history = useHistory();
  let params = useParams();
  let [categoryName, setCategoryName] = useState("");
  let [categoryNameCheck, setCategoryNameCheck] = useState(false);
  let [phase, setPhase] = useState([]);
  let [phaseCheck, setPhaseCheck] = useState(false);
  let [iconCheck, setIconCheck] = useState(false);
  let [addLogo, setAddLogo] = useState(false);
  let [refreshLogo, setRefreshLogo] = useState(false);
  let [modal, setModal] = useState(false);
  let [tempIcon, setTempIcon] = useState({
    iconId: null,
    iconUrl: null,
  });
  let [errorResponse, setErrorResponse] = useState({
    message: null,
    code: null,
    isFound: false,
  });
  let [icons, setIcons] = useState([
    {
      iconId: null,
      iconUrl: null,
    },
  ]);
  let [mediaInput, setMediaInput] = useState({
    type: "image",
    source: null,
    isError: false,
    errorMessage: null,
  });
  let [successResponse, setSuccessResponse] = useState({
    message: null,
    code: 200,
    isFound: true,
  });
  let [spinnerShow, setSpinnerShow] = useState(false);
  const logoInputRef = useRef();

  useEffect(() => {
    console.log("phase", phase);
    setErrorResponse({ message: null, code: null, isFound: false });
    setSuccessResponse({ message: null, code: null, isFound: false });
  }, [categoryName, phase]);

  useEffect(() => {
    if (params.id) {
      let req = {
        pathParams: {
          id: params.id,
        },
      };
      setSpinnerShow(true);
      getFoodLogCategory(req)
        .then((response) => {
          setErrorResponse({ message: null, code: null, isFound: false });
          setCategoryName(response.foodType.food_type);
          setPhase([
            phaseList.find((ph) => ph.id == response.foodType.phase_id),
          ]);
          setMediaInput({
            type: "image",
            source: response.foodType.icon_url,
            isError: false,
            errorMessage: null,
          });
          setSpinnerShow(false);
        })
        .catch((error) => {
          setSpinnerShow(false);
          setErrorResponse({
            message: error.message || null,
            code: error.status || null,
            isFound: true,
          });
        });
    }
  }, []);

  useEffect(() => {
    getCategoryLogo()
      .then((response) => {
        let updatedIcons = response.logoList.map((logo) => ({
          iconId: logo.id,
          iconUrl: logo.icon_url,
        }));
        setErrorResponse({ message: null, code: null, isFound: false });
        setIcons(updatedIcons);
      })
      .catch((error) => {
        setErrorResponse({
          message: error.message || null,
          code: error.status || null,
          isFound: true,
        });
      });
    setRefreshLogo(false);
  }, [refreshLogo]);

  useEffect(() => {
    if (addLogo) {
      let data = {
        icon_url: mediaInput.source,
      };
      let req = {
        data,
      };
      addCategoryLogo(req)
        .then((response) => {
          setSpinnerShow(false);
          setErrorResponse({ message: null, code: null, isFound: false });
          setSuccessResponse({
            message: null,
            code: 200 || null,
            isFound: true,
          });
          setRefreshLogo(true);
        })
        .catch((error) => {
          setSpinnerShow(false);
          setErrorResponse({
            message: error.message || null,
            code: error.status || null,
            isFound: true,
          });
        });
      setAddLogo(false);
    }
  }, [addLogo]);

  let validateField = () => {
    let result = true;
    if (!categoryName || categoryName.trim() == "") {
      setCategoryNameCheck(true);
      result = false;
    }
    if (phase.length == 0) {
      setPhaseCheck(true);
      result = false;
    }

    if (mediaInput.source == null) {
      setMediaInput({
        ...mediaInput,
        type: null,
        source: null,
        isError: true,
        errorMessage: "",
      });
      setIconCheck(true);
      result = false;
    }
    return result;
  };

  let handleFileChange = (e) => {
    if (e.target.files[0]) {
      setIconCheck(false);
      let fileType = e.target.files[0].type.split("/")[0];
      if (fileType != "image") {
        setMediaInput({
          ...mediaInput,
          type: null,
          source: null,
          isError: true,
          errorMessage: "Only image allowed",
        });
        return;
      }

      if (e.target.files[0].size > 512000) {
        setMediaInput({
          ...mediaInput,
          type: null,
          source: null,
          isError: true,
          errorMessage: "Image size must be less than 500 kb",
        });
        return;
      }

      let formData = new FormData();
      formData.append("folderName", "logo_library");
      formData.append("image", e.target.files[0]);
      let req = {
        data: formData,
      };
      setSpinnerShow(true);
      upload(req)
        .then((response) => {
          setErrorResponse({ message: null, code: null, isFound: false });
          setMediaInput({
            ...mediaInput,
            isError: false,
            type: fileType,
            source: response.image_url,
          });
          setAddLogo(true);
          setSpinnerShow(false);
        })
        .catch((error) => {
          setSpinnerShow(false);
          setMediaInput({ ...mediaInput, isError: true });
          setErrorResponse({
            message: error.message || null,
            code: error.status || null,
            isFound: true,
          });
        });
    }
  };

  let handleSubmit = (e) => {
    e.preventDefault();
    if (!validateField()) {
      return;
    }
    setSpinnerShow(true);
    setErrorResponse({ message: null, code: null, isFound: false });
    setSuccessResponse({ message: null, code: null, isFound: false });

    let data = {
      food_type: categoryName,
      icon_url: mediaInput.source,
    };

    if (params.id) {
      data = {
        ...data,
        phase_id: phase[0].id, //phase
      };

      let req = {
        pathParams: {
          id: params.id,
        },
        data,
      };

      editFoodLogCategory(req)
        .then((response) => {
          setSpinnerShow(false);
          setErrorResponse({ message: null, code: null, isFound: false });
          setSuccessResponse({
            message: "Updated Successfully" || null,
            code: 200 || null,
            isFound: true,
          });
          history.push("/listFoodLogCategory");
        })
        .catch((error) => {
          setSpinnerShow(false);
          setErrorResponse({
            message: error.message || null,
            code: error.status || null,
            isFound: true,
          });
        });
    } else {
      data = {
        ...data,
        phase_id: phase.map((ph) => ph.id), //phase
      };

      let req = {
        data,
      };
      addFoodLogCategory(req)
        .then((response) => {
          setSpinnerShow(false);
          setErrorResponse({ message: null, code: null, isFound: false });
          setSuccessResponse({
            message: "Saved Successfully" || null,
            code: 200 || null,
            isFound: true,
          });
          history.push("/listFoodLogCategory");
        })
        .catch((error) => {
          setSpinnerShow(false);
          setErrorResponse({
            message: error.message || null,
            code: error.status || null,
            isFound: true,
          });
        });
    }
  };
  const handleIconSelected = (icon) => {
    tempIcon.iconId === icon.iconId
      ? setTempIcon({ iconId: null, iconUrl: null })
      : setTempIcon({ iconId: icon.iconId, iconUrl: icon.iconUrl });
  };

  let handleReset = (e) => {
    e.preventDefault();
    setSpinnerShow(false);
    setCategoryName("");
    setPhase(1);
    setPhaseCheck(false);
    setCategoryNameCheck(false);
  };

  let toggleModal = () => {
    setModal(!modal);
  };

  return (
    <CContainer fluid>
      <CModal
        show={modal}
        onClose={toggleModal}
        closeOnBackdrop={false}
        backdrop
        centered
        style={{ fontFamily: "Poppins" }}
      >
        <CModalHeader
          style={{ height: "3rem", backgroundColor: "teal", color: "white" }}
          closeButton
        >
          <CModalTitle>Select Logo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div
            style={{
              height: "250px",
              overflow: "hidden",
              overflowY: "scroll",
            }}
          >
            <div className="d-flex flex-row flex-wrap mb-3">
              {icons.map((icon) => (
                <div style={{ margin: "1rem" }}>
                  <CImg
                    src={icon.iconUrl}
                    width="30"
                    height="30"
                    onClick={() => handleIconSelected(icon)}
                    style={
                      icon.iconId === tempIcon.iconId
                        ? {
                            border: "2px solid rgba(0,0,0,0.2)",
                            padding: "3px",
                            borderRadius: "5px",
                          }
                        : {}
                    }
                  />
                </div>
              ))}
            </div>
            {/* <div>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's standard
              dummy text ever since the 1500s, when an unknown printer took a
              galley of type and scrambled it to make a type specimen book. It
              has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem IpsumLorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's standard
              dummy text ever since the 1500s, when an unknown printer took a
              galley of type and scrambled it to make a type specimen book. It
              has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem IpsumLorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's standard
              dummy text ever since the 1500s, when an unknown printer took a
              galley of type and scrambled it to make a type specimen book. It
              has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum
            </div> */}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            style={{ backgroundColor: "#008080", color: "#fff" }}
            onClick={() => {
              toggleModal();
              setMediaInput({
                type: "image",
                source: tempIcon.iconUrl,
                isError: false,
              });
            }}
          >
            OK
          </CButton>
        </CModalFooter>
      </CModal>
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>
                  {history.location.pathname == "/addFoodLogCategory"
                    ? "Add Food Log Category"
                    : "Edit Food Log Category"}
                  <CSpinner
                    style={{
                      color: "#008080",
                      marginLeft: "2rem",
                      display: spinnerShow ? "" : "none",
                    }}
                  />
                </h2>
                {/* <CButton
                        style={{ width: "5rem",backgroundColor:"#008080",color:"#fff"}}
                        onClick={()=>history.goBack()}
                    >
                        <strong>Back</strong>
                    </CButton> */}
              </div>
            </CCardHeader>
            <CCardBody>
              <div
                style={{
                  color: "red",
                  fontSize: "1rem",
                  display: errorResponse.isFound ? "flex" : "none",
                  justifyContent: "center",
                }}
              >
                <div>
                  <h5>{errorResponse.message}</h5>
                </div>
              </div>
              <div
                style={{
                  color: "green",
                  fontSize: "1rem",
                  display: successResponse.isFound ? "flex" : "none",
                  justifyContent: "center",
                }}
              >
                <div>
                  <h5>{successResponse.message}</h5>
                </div>
              </div>
              <CForm
                action=""
                method="post"
                onSubmit={handleSubmit}
                autoComplete="off"
              >
                <CFormGroup>
                  <CLabel
                    style={{ fontWeight: "600", fontSize: "1rem" }}
                    htmlFor="phase"
                  >
                    Phase:
                  </CLabel>

                  <Select
                    options={phaseList}
                    isMulti={params.id ? false : true}
                    placeholder="Select Phase"
                    onChange={(e) => {
                      console.log(e);
                      console.log(e);
                      setPhaseCheck(false);
                      params.id ? setPhase([e]) : setPhase(e);
                    }}
                    value={phase}
                  />
                  <div
                    style={{
                      color: "red",
                      marginLeft: "0.1rem",
                      display: phaseCheck ? "" : "none",
                    }}
                  >
                    Phase is required
                  </div>
                </CFormGroup>

                <CFormGroup>
                  <CLabel
                    style={{ fontWeight: "600", fontSize: "1rem" }}
                    htmlFor="category_name"
                  >
                    Category Name:
                  </CLabel>
                  <CInput
                    onChange={(e) => {
                      setCategoryNameCheck(false);
                      setCategoryName(e.target.value);
                    }}
                    value={categoryName}
                    type="text"
                    id="category_name"
                    name="category_name"
                    placeholder="Enter Category Name"
                    //required
                  />
                  <div
                    style={{
                      color: "red",
                      marginLeft: "0.1rem",
                      display: categoryNameCheck ? "" : "none",
                    }}
                  >
                    Category name is required
                  </div>
                </CFormGroup>

                <CFormGroup style={{ display: "flex", alignItems: "center" }}>
                  <CLabel
                    style={{
                      marginRight: "2rem",
                      fontWeight: "600",
                      fontSize: "1rem",
                    }}
                    htmlFor="category_icon"
                  >
                    Category Logo:
                  </CLabel>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid rgba(0,0,0,0.2)",
                      height: "80px",
                      width: "80px",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                  >
                    <div>
                      <CImg
                        style={{
                          height: "40px",
                          width: "40px",
                        }}
                        src={mediaInput.source}
                        shape="rounded"
                      />
                    </div>
                  </div>
                  <CButton
                    style={{ width: "4rem", marginLeft: "3rem" }}
                    color="info"
                    size="sm"
                    onClick={() => toggleModal()}
                  >
                    Browse
                  </CButton>
                  <input
                    id="category_logo"
                    name="category_logo"
                    type="file"
                    style={{ cursor: "pointer", display: "none" }}
                    ref={logoInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <CButton
                    style={{ width: "4rem", marginLeft: "1rem" }}
                    color="dark"
                    size="sm"
                    onClick={() => logoInputRef.current.click()}
                  >
                    Upload
                  </CButton>
                  <CLabel
                    style={{
                      color: "red",
                      marginLeft: "1rem",
                      marginTop: "1rem",
                      display: mediaInput.isError ? "block" : "none",
                    }}
                  >
                    {mediaInput.errorMessage}
                  </CLabel>
                  <CLabel
                    style={{
                      color: "red",
                      marginLeft: "1rem",
                      marginTop: "1rem",
                      display: iconCheck ? "" : "none",
                    }}
                  >
                    Category Logo is required
                  </CLabel>
                </CFormGroup>

                <CFormGroup
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CButton
                    disabled={spinnerShow}
                    style={{
                      width: "5rem",
                      marginRight: "3rem",
                      backgroundColor: "#008080",
                      color: "#fff",
                    }}
                    type="submit"
                  >
                    {spinnerShow ? (
                      <CSpinner style={{ color: "#fff" }} size="sm" />
                    ) : (
                      "Save"
                    )}
                  </CButton>
                  <CButton
                    style={{ width: "5rem", marginLeft: "3rem" }}
                    color="danger"
                    onClick={(e) => history.goBack()}
                  >
                    Cancel
                  </CButton>
                </CFormGroup>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default AddEditFoodLogCategory;
