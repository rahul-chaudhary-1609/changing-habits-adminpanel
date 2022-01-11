import React from "react";
import { useState, useEffect, useRef } from "react";
import { Route, useHistory, Link } from "react-router-dom";
import {
  CInputGroupText,
  CCardBody,
  CContainer,
  CRow,
  CCol,
  CCard,
  CSpinner,
  CCardHeader,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import ListSuggestionPDFs from "./ListSuggestionPDFs";
import ListFoodLog from "./ListFoodLog";

const ListSuggetion = (props) => {
  let history = useHistory();
  let suggestionPDFsButton = false;
  let foodLogButton = true;

  if (props.match.params.type == "suggestionpdfs") {
    suggestionPDFsButton = true;
    foodLogButton = false;
  } else {
    foodLogButton = true;
    suggestionPDFsButton = false;
  }

  let [spinnerShow, setSpinnerShow] = useState(false);

  return (
    <CContainer>
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader>
              {/* <div style={{display:"flex", justifyContent:"space-between"}}> */}
              <h2>
                Food Log Suggestion{" "}
                <CSpinner
                  style={{
                    color: "#008080",
                    marginLeft: "2rem",
                    display: spinnerShow ? "" : "none",
                  }}
                />
              </h2>
              <CButton
                style={{
                  width: "5rem",
                  float: "right",
                  backgroundColor: "#008080",
                  color: "#fff",
                  display:
                    props.match.params.type == "suggestionpdfs" ? "none" : "",
                }}
                onClick={() => history.push("/addFoodLogSuggestion")}
              >
                <strong>Add</strong>
              </CButton>
              <div
                style={{
                  height: "2.2rem",
                  display:
                    props.match.params.type == "suggestionpdfs" ? "" : "none",
                }}
              ></div>
              {/* </div> */}
            </CCardHeader>
            <CCardBody>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginRight: "2rem",
                  marginBottom: "2rem",
                }}
              >
                <CButton
                  style={{
                    width: "12rem",
                    marginLeft: "2rem",
                    backgroundColor: suggestionPDFsButton ? "gray" : "#008080",
                    color: "#fff",
                  }}
                  onClick={() => {
                    history.push("/listFoodLogSuggestion/foodlog");
                  }}
                >
                  {" "}
                  <strong>Food Log</strong>
                </CButton>
                <CButton
                  style={{
                    width: "12rem",
                    marginLeft: "2rem",
                    backgroundColor: suggestionPDFsButton ? "#008080" : "gray",
                    color: "#fff",
                  }}
                  onClick={() => {
                    history.push("/listFoodLogSuggestion/suggestionpdfs");
                  }}
                >
                  <strong>Suggestion PDFs</strong>
                </CButton>
              </div>

              {suggestionPDFsButton ? <ListSuggestionPDFs /> : <ListFoodLog />}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ListSuggetion;
