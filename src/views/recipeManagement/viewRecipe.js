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
  CInput,
} from "@coreui/react";

import { GetRecipeDetail, ToggleRecipeStatus } from "../../api";
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
  const [action, setAction] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectedMsgError, setRejectedMsgError] = useState(null);

  const toggleStatus = (status) => {
    setStatus(status);
    setEnableModal(!enableModal);
  };

  const handleEnable = async () => {
    if (action == "reject" && rejectReason == "") {
      setRejectedMsgError("Reason is required");
    } else {
      try {
        setEnableModal(!enableModal);
        let data = {};
        data.status = action == "reject" ? 2 : 1;
        if (rejectReason) {
          data.reject_reason = rejectReason;
        }
        await ToggleRecipeStatus(params.id, data);
        setRefresh(!refresh);
      } catch (error) {
        console.log(error);
      }
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
          onClose={setEnableModal}
          backdrop={true}
          style={{ fontFamily: "Poppins" }}
        >
          <CModalHeader
            style={{ height: "3rem", backgroundColor: "teal", color: "white" }}
          >
            <CModalTitle>
              {action == "reject" ? "Reject Recipe?" : "Approve Recipe?"}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {action == "reject"
              ? "Are you sure you want to reject the recipe?"
              : "Are you sure you want to approve the recipe?"}
            {action == "reject" ? (
              <div style={{ paddingTop: "5px" }}>
                <CFormGroup row>
                  <CCol md="2">
                    <CLabel htmlFor="hf-categorytype">
                      <h6>Reason:</h6>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="10">
                    <CInput
                      type="text"
                      id="reject_reason"
                      name="reject_reason"
                      onChange={(e) => {
                        setRejectReason(e.target.value);
                      }}
                      placeholder="Provide here the reason of recipe rejection"
                    />
                  </CCol>
                  {rejectedMsgError ? (
                    <div
                      className="email-validate"
                      style={{ marginLeft: "1rem" }}
                    >
                      {rejectedMsgError}
                    </div>
                  ) : null}
                </CFormGroup>
              </div>
            ) : (
              ""
            )}
          </CModalBody>
          <CModalFooter style={{ height: "4rem" }}>
            <CButton
              onClick={handleEnable}
              style={{ backgroundColor: "teal", color: "white" }}
            >
              Yes
            </CButton>{" "}
            <CButton color="danger" onClick={() => setEnableModal(false)}>
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
                    <div style={{ textAlign: "right" }}>
                      <CButton
                        style={{ cursor: "pointer", backgroundColor: "gray" }}
                        title="Click to go back"
                      >
                        <strong>
                          {" "}
                          <FontAwesomeIcon
                            color="white"
                            size="lg"
                            style={{ cursor: "pointer", color: "black" }}
                            icon={faArrowLeft}
                            onClick={() => history.goBack()}
                          />
                        </strong>
                      </CButton>
                    </div>
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
                      <CCol xs="4" md="9" style={{ whiteSpace: "pre-line" }}>
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
                      <CCol xs="4" md="9" style={{ whiteSpace: "pre-line" }}>
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
                        {show.status == 0 || show.status == 2 ? (
                          <>
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
                              style={{ width: "77px" }}
                              onClick={() => {
                                toggleStatus(show.status);
                                setAction("reject");
                              }}
                            >
                              Reject
                            </CButton>
                            <CButton
                              name="approve"
                              disabled={show.status == 1 ? true : false}
                              title={
                                show.status == 1
                                  ? "Recipe already approved"
                                  : "Click to approve recipe"
                              }
                              style={{
                                cursor: "pointer",
                                marginLeft: "2rem",
                                backgroundColor: "teal",
                                color: "white",
                              }}
                              onClick={() => {
                                toggleStatus(show.status);
                                setAction("approve");
                              }}
                            >
                              Approve
                            </CButton>
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    )}
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
