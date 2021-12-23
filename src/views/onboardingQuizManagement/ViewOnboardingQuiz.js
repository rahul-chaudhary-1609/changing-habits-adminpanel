import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  CFormText,
  CCardBody,
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CLabel,
  CButton,
  CTextarea,
  CSpinner,
  CInputGroup,
  CInput,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { getOnboardingQuiz } from "../../data/onboardingQuizManagement";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { CustomEditorViewer } from "src/utils/components/customEditor";
import { listCategories } from "../../utils/helper";
import { allQuestionTypes } from "../../utils/helper";

function ViewOnboardingQuiz(props) {
  let history = useHistory();
  let params = useParams();
  let [questionType, setQuestionType] = useState();
  // let [questionTypeNumber, setQuestionTypeNumber] = useState();
  let [category, setCategory] = useState("");
  let [question, setQuestion] = useState("");
  let [description, setDescription] = useState("");
  let [correctOption, setCorrectOption] = useState("");
  let [errorResponse, setErrorResponse] = useState({
    message: null,
    code: null,
    isFound: false,
  });

  let [optionInputFields, setOptionInputFields] = useState([
    { option_no: 1, option_value: "", isRequired: true },
    { option_no: 2, option_value: "", isRequired: true },
  ]);

  let [spinnerShow, setSpinnerShow] = useState(false);

  useEffect(() => {
    if (params.id) {
      let req = {
        pathParams: {
          id: params.id,
        },
      };
      setSpinnerShow(true);
      getOnboardingQuiz(req)
        .then((response) => {
          setErrorResponse({ message: null, code: null, isFound: false });
          let categoryDisplay = listCategories.filter((c) => {
            return c.option_no == response.onboardingQuizDetails.category_type;
          });
          setCategory(categoryDisplay[0].option_value);
          let questionTypeDisplay = allQuestionTypes.filter((q) => {
            return q.option_no == response.onboardingQuizDetails.question_type;
          });
          setQuestionType(questionTypeDisplay[0].option_value);
          // setQuestionTypeNumber(questionTypeDisplay[0].option_no);
          setQuestion(response.onboardingQuizDetails.question);
          setDescription(response.onboardingQuizDetails.description);
          let currentOptionInputFields = [
            {
              option_no: 1,
              option_value: response.onboardingQuizDetails.option_1,
              isRequired: true,
            },
            {
              option_no: 2,
              option_value: response.onboardingQuizDetails.option_2,
              isRequired: true,
            },
          ];
          if (response.onboardingQuizDetails.option_3) {
            currentOptionInputFields.push({
              option_no: 3,
              option_value: response.onboardingQuizDetails.option_3,
              isRequired: false,
            });
          }
          if (response.onboardingQuizDetails.option_4) {
            currentOptionInputFields.push({
              option_no: 4,
              option_value: response.onboardingQuizDetails.option_4,
              isRequired: false,
            });
          }
          if (response.onboardingQuizDetails.option_5) {
            currentOptionInputFields.push({
              option_no: 5,
              option_value: response.onboardingQuizDetails.option_5,
              isRequired: false,
            });
          }
          if (response.onboardingQuizDetails.option_6) {
            currentOptionInputFields.push({
              option_no: 6,
              option_value: response.onboardingQuizDetails.option_6,
              isRequired: false,
            });
          }
          console.log("input fields===========  ", currentOptionInputFields);

          setOptionInputFields(currentOptionInputFields);
          // let answer = currentOptionInputFields.find(
          //   (optionInputField) =>
          //     optionInputField.option_no ==
          //     response.onboardingQuizDetails.correct_option
          // );
          console.log(response);
          if (response.onboardingQuizDetails.question_type !== 3) {
            let answer = [];
            for (let i = 0; i < currentOptionInputFields.length; i++) {
              for (
                let j = 0;
                j < response.onboardingQuizDetails.correct_option.length;
                j++
              ) {
                if (
                  response.onboardingQuizDetails.correct_option[j] ==
                  currentOptionInputFields[i].option_no
                ) {
                  answer.push(currentOptionInputFields[i].option_value);
                }
              }
            }
            setCorrectOption(answer.toString());
          }
          //console.log(correctOption);
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

  return (
    <CContainer fluid>
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>
                  View Learning Quiz
                  <CSpinner
                    style={{
                      color: "#008080",
                      marginLeft: "2rem",
                      display: spinnerShow ? "" : "none",
                    }}
                  />
                </h2>

                <CButton
                  style={{ backgroundColor: "gray" }}
                  onClick={() => history.goBack()}
                >
                  <strong>
                    <FontAwesomeIcon
                      color="white"
                      size="lg"
                      style={{ cursor: "pointer", color: "black" }}
                      icon={faArrowLeft}
                    />
                  </strong>
                </CButton>
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
              <div style={{ display: "flex", justifyContent: "center" }}>
                <table cellpadding="12" cellSpacing="10">
                  <tr>
                    <td>
                      <CLabel
                        style={{ fontWeight: "600", fontSize: "1rem" }}
                        htmlFor="question"
                      >
                        Category
                      </CLabel>
                    </td>
                    <td>:</td>
                    <td>{category}</td>
                  </tr>
                  <tr>
                    <td>
                      <CLabel
                        style={{ fontWeight: "600", fontSize: "1rem" }}
                        htmlFor="question"
                      >
                        Question Type
                      </CLabel>
                    </td>
                    <td>:</td>
                    <td>{questionType}</td>
                  </tr>

                  <tr>
                    <td>
                      <CLabel
                        style={{ fontWeight: "600", fontSize: "1rem" }}
                        htmlFor="question"
                      >
                        Question
                      </CLabel>
                    </td>
                    <td>:</td>
                    <td>{question}</td>
                  </tr>
                  <tr
                    style={{
                      display: questionType !== "Input-Box" ? "" : "none",
                    }}
                  >
                    <td>
                      <CLabel
                        style={{ fontWeight: "600", fontSize: "1rem" }}
                        htmlFor="option"
                      >
                        Options:
                      </CLabel>
                    </td>
                    <td>:</td>
                    <td>
                      {optionInputFields.map((optionInputField, index) => {
                        return (
                          <CInputGroup
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop:
                                optionInputField.option_no > 1
                                  ? "0.5rem"
                                  : "none",
                            }}
                          >
                            <CInput
                              value={optionInputField.option_value}
                              type="optionInputField"
                              placeholder={`Enter option ${optionInputField.option_no}`}
                            />
                          </CInputGroup>
                        );
                      })}
                    </td>
                  </tr>
                  <tr
                    style={{
                      display: questionType !== "Input-Box" ? "" : "none",
                    }}
                  >
                    <td>
                      <CLabel
                        style={{ fontWeight: "600", fontSize: "1rem" }}
                        htmlFor="correct_option"
                      >
                        Corrent Option:
                      </CLabel>
                    </td>
                    <td>:</td>
                    <td>{correctOption}</td>
                  </tr>
                  <tr>
                    <td>
                      <CLabel
                        style={{ fontWeight: "600", fontSize: "1rem" }}
                        htmlFor="description"
                      >
                        Description
                      </CLabel>
                    </td>
                    <td>:</td>
                    <td>
                      {/* <CTextarea
                            value={description}
                            id="description"
                            name="description"
                              rows="5"
                              cols="80"
                            placeholder="Enter Description"
                            required
                        /> */}
                      <CustomEditorViewer description={description} />
                    </td>
                  </tr>
                </table>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default ViewOnboardingQuiz;
