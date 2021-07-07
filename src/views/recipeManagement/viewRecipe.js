import React, { useState, useEffect } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormGroup,
  CLabel,
  CModal,
  CModalHeader,
  CModalFooter,
  CModalBody,
  CModalTitle,
} from "@coreui/react";

import { GetRecipeDetail, ToggleRecipeStatus } from "../../api";
import { useHistory, useParams } from "react-router-dom";

export default function ViewRecipe() {
  const history = useHistory();
  const params = useParams();

  const [show, setShow] = useState({});

  const phase = (label) => {
    switch (label) {
      case 1:
        return "kisckstart";
      case 2:
        return "phase 1";
      case 3:
        return "phase 2";
      case 4:
        return "phase 3";
      case 5:
        return "phase 4";
      default:
        return "phase 4 eva";
    }
  };

  const [loading, setLoading] = useState(false);
  const [enableModal, setEnableModal] = useState(false);
  const [status, setStatus] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const toggleStatus = (status) => {
    setStatus(status);
    setEnableModal(!enableModal);
  };

  const handleEnable = async () => {
    try {
      setEnableModal(!enableModal);
      let pass;
      if (status) {
        pass = 2;
      } else {
        pass = 1;
      }
      await ToggleRecipeStatus(params.id, pass);
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const GetRecipe = async () => {
      try {
        const result = await GetRecipeDetail(params.id);
        if (result) {
          setLoading(false);
          setShow(result.recipeDetails);
        }
      } catch (error) {
        console.log(error);
      }
    };

    GetRecipe();
  }, [refresh]);

  return (
    <>
      {enableModal ? (
        <CModal
          show={enableModal}
          centered={true}
          color="warning"
          onClose={setEnableModal}
          backdrop={true}
          style={{ fontFamily: "Poppins" }}
        >
          <CModalHeader style={{ height: "3rem" }}>
            <CModalTitle>
              {status ? "Reject Recipe?" : "Approve Recipe?"}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {status
              ? "Are you sure you want to reject the recipe?"
              : "Are you sure you want to approve the recipe?"}
          </CModalBody>
          <CModalFooter style={{ height: "4rem" }}>
            <CButton color="success" onClick={handleEnable}>
              Yes
            </CButton>{" "}
            <CButton color="secondary" onClick={() => setEnableModal(false)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      ) : (
        ""
      )}
      <CContainer
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {
          <CCol xl="10" md="10">
            <CCard>
              <CCardHeader style={{ fontFamily: "Lato" }}>
                <h3>
                  <strong>View Recipe Details</strong>
                </h3>
              </CCardHeader>

              <CCardBody
                style={{
                  fontFamily: "Roboto",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="form-horizontal">
                  <div style={{ margin: "auto" }}>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel>
                          <h6>
                            <strong>Recipe Title : </strong>
                          </h6>
                        </CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        {show.recipe_title}
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="hf-recipe_image_url">
                          <h6>
                            <strong>Recipe Image : </strong>
                          </h6>
                        </CLabel>
                      </CCol>
                      {show.recipe_image_url ? (
                        <CCol xs="12" md="9">
                          <label
                            className="block w-1/2 tracking-wide  mb-2 text-gray-300 h-50  w-1/2"
                            for="images"
                          >
                            <img
                              alt="Upload Image"
                              style={{
                                minHeight: "200px",
                                minWidth: "100%",
                                backgroundColor: "lightgray",
                                textAlign: "center",
                                height: "100px",
                                cursor: "pointer",
                              }}
                              src={show.recipe_image_url}
                              title={show.recipe_image_url}
                            />
                          </label>
                        </CCol>
                      ) : (
                        "N/A"
                      )}
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel
                          style={{ fontFamily: "Poppins" }}
                          htmlFor="textarea-input"
                        >
                          <h6>
                            <strong>Recipe Ingredients : </strong>
                          </h6>
                        </CLabel>
                      </CCol>
                      <CCol xs="4" md="9">
                        {show.recipe_ingredients}
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel
                          style={{ fontFamily: "Poppins" }}
                          htmlFor="textarea-input"
                        >
                          <h6>
                            <strong>Recipe Methods : </strong>
                          </h6>
                        </CLabel>
                      </CCol>
                      <CCol xs="4" md="9">
                        {show.recipe_methods}
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel
                          style={{ fontFamily: "Poppins" }}
                          htmlFor="recipe_type"
                        >
                          <h6>
                            <strong>Recipe type : </strong>
                          </h6>
                        </CLabel>
                      </CCol>
                      <CCol row md="3">
                        <label for={1}>
                          {show.recipe_type == 1 ? "Veg" : "Non Veg"}
                        </label>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="hf-category">
                          <h6>
                            <strong>Phase : </strong>
                          </h6>
                        </CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        {phase(show.phase_id)}
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="hf-category">
                          <h6>
                            <strong>Status : </strong>
                          </h6>
                        </CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        {show.status == 0
                          ? "Pending"
                          : show.status == 1
                          ? "Approved"
                          : "Rejected"}
                      </CCol>
                    </CFormGroup>
                  </div>
                  <div style={{ textAlign: "-webkit-center" }}>
                    {loading ? (
                      <div
                        className="spinner-border text-success"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      <>
                        {show.role == 1 ? (
                          <>
                            <CButton
                              name="approve"
                              disabled={show.status == 1 ? true : false}
                              title={
                                show.status == 1
                                  ? "Recipe already approved"
                                  : "Click to approve recipe"
                              }
                              color="primary"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                toggleStatus(show.status);
                              }}
                            >
                              Approve
                            </CButton>
                            <CButton
                              name="reject"
                              disabled={show.status == 2 ? true : false}
                              title={
                                show.status == 2
                                  ? "Recipe already rejected"
                                  : "Click to reject recipe"
                              }
                              style={{ cursor: "pointer" }}
                              color="danger"
                              style={{ marginLeft: "2rem", width: "77px" }}
                              onClick={() => {
                                toggleStatus(show.status);
                              }}
                            >
                              Reject
                            </CButton>
                          </>
                        ) : (
                          ""
                        )}
                        <CButton
                          name="edit"
                          color="success"
                          style={{
                            marginLeft: "2rem",
                            width: "77px",
                            cursor: "pointer",
                          }}
                          title="Click to edit recipe"
                          onClick={() =>
                            history.push({
                              pathname: `/addRecipe/${params.id}`,
                            })
                          }
                        >
                          Edit
                        </CButton>
                      </>
                    )}
                    <CButton
                      style={{ marginLeft: "2rem", cursor: "pointer" }}
                      color="danger"
                      title="Click to go back"
                      onClick={() => history.goBack()}
                    >
                      <strong>Cancel</strong>
                    </CButton>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        }
      </CContainer>
    </>
  );
}