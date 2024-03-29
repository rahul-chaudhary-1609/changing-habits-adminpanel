import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
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
  CTextarea,
  CSelect,
  CInputGroup,
  CInputGroupAppend,
  CBadge,
  CSpinner,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody
} from "@coreui/react"
import { FaPlus, FaMinus } from 'react-icons/fa';
import { getPhaseDays, getLearningQuiz, addLearningQuiz, editLearningQuiz, listQuizContentType } from "../../data/learningContentManagement"
import { checkLeapYear } from "../../utils/helper";
import { CustomEditor } from "src/utils/components/customEditor";

function AddEditLearningQuiz() {
  let history = useHistory();
  let params = useParams();
  let customEditorRef = useRef();
  let [data, setData] = useState([]);
  let [content, setContent] = useState("");
  let [contentCheck, setContentCheck] = useState(false);
  let [question, setQuestion] = useState("");
  let [questionCheck, setQuestionCheck] = useState(false);
  let [description, setDescription] = useState("");
  let [descriptionCheck, setDescriptionCheck] = useState(false);
  let [phase, setPhase] = useState(0);
  let [phaseCheck, setPhaseCheck] = useState(false);
  let [phaseDay, setPhaseDay] = useState(0);
  let [phaseDayCheck, setPhaseDayCheck] = useState(false);
  let [correctOption, setCorrectOption] = useState(0);
  let [correctOptionCheck, setCorrectOptionCheck] = useState(false);
  let [errorResponse, setErrorResponse] = useState({
    message: null,
    code: null,
    isFound: false,
  });

  let [successResponse, setSuccessResponse] = useState({
    message: null,
    code: 200,
    isFound: true,
  });

  let [optionInputFields, setOptionInputFields] = useState(
    [
      { option_no: 1, option_value: "", isRequired: false, check: false },
      { option_no: 2, option_value: "", isRequired: false, check: false },
      //{ option_no: 3, option_value: "",isRequired:false,check:false },
      //{ option_no: 4, option_value: "",isRequired:true,check:false },
    ]
  )
  let [optionInputFieldsCheck, setOptionInputFieldsCheck] = useState(false);
  let phases = [
    {
      id: 1,
      name: "Kickstart"
    },
    {
      id: 2,
      name: "Phase 1"
    },
    {
      id: 3,
      name: "Phase 2"
    },
    {
      id: 4,
      name: "Phase 3"
    },
    {
      id: 5,
      name: "Phase 4"
    },
    {
      id: 6,
      name: "Phase 4 EVA"
    }

  ]

  let [phaseDaysList, setPhaseDaysList] = useState([]);
  let [spinnerShow, setSpinnerShow] = useState(false)

  useEffect(() => {
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })
  }, [question, description, phase, phaseDay, phaseDaysList, correctOption, optionInputFields])

  useEffect(() => {
    if (params.id) {
      let req = {
        pathParams: {
          id: params.id,
        },
      }
      setSpinnerShow(true)
      getLearningQuiz(req).then((response) => {

        setErrorResponse({ message: null, code: null, isFound: false })
        setQuestion(response.quizDetails.question)
        setDescription(response.quizDetails.description)
        customEditorRef.current.updateEditorValue()
        setPhase(response.quizDetails.phase_id)
        setPhaseDay(response.quizDetails.phase_day)
        let currentOptionInputFields = [
          { option_no: 1, option_value: response.quizDetails.option_1, isRequired: false, check: false },
          { option_no: 2, option_value: response.quizDetails.option_2, isRequired: false, check: false },
        ];
        if (response.quizDetails.option_3) {
          currentOptionInputFields.push({ option_no: 3, option_value: response.quizDetails.option_3, isRequired: false, check: false })
        }
        if (response.quizDetails.option_4) {
          currentOptionInputFields.push({ option_no: 4, option_value: response.quizDetails.option_4, isRequired: false, check: false })
        }
        if (response.quizDetails.option_5) {
          currentOptionInputFields.push({ option_no: 5, option_value: response.quizDetails.option_5, isRequired: false, check: false })
        }
        if (response.quizDetails.option_6) {
          currentOptionInputFields.push({ option_no: 6, option_value: response.quizDetails.option_6, isRequired: false, check: false })
        }
        setOptionInputFields(currentOptionInputFields)
        setCorrectOption(response.quizDetails.correct_option)
        setSpinnerShow(false)

      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }
  }, [])


  useEffect(() => {
    if (phase > 0) {
      let req = {
        pathParams: {
          id: phase,
        },
      }
      setSpinnerShow(true)
      getPhaseDays(req).then((response) => {
        setSpinnerShow(false)
        let newPhaseDaysList = []
        let limit = response.phaseDays ? response.phaseDays : checkLeapYear(new Date().getFullYear()) ? 366 : 365;
        for (let i = 1; i <= limit; i++) {
          newPhaseDaysList.push(i)
        }
        setPhaseDaysList([...newPhaseDaysList]);
        setErrorResponse({ message: null, code: null, isFound: false })
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    } else {
      setPhaseDaysList([]);
    }


    const getData = async () => {
      try {
        let req = {
          queryParams: {
            //  searchKey: searchKey,
            //   page: page.number,
            page_size: 100
          }
        }
        //  setLoading(true)
        let response = await listQuizContentType(req);
        console.log(response)
        setData(response.quizContentTypes);
        // setLoading(false)
        setErrorResponse({ message: null, code: null, isFound: false })


      } catch (error) {
        setData([])
        if (error.message) {
          // setLoading(false)
          //  setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
        }
      }
    }


    getData();
  }, [phase])

  let handleAddOptionField = () => {
    if (optionInputFields.length >= 1) {
      setOptionInputFieldsCheck(false);
    }

    let currentOptionInputFields = [...optionInputFields];
    currentOptionInputFields.push({ option_no: currentOptionInputFields.length + 1, option_value: "", isRequired: false, check: false })
    currentOptionInputFields = currentOptionInputFields.map((currentOptionInputField, key) => {
      return { ...currentOptionInputField, option_no: ++key }
    })
    setOptionInputFields(currentOptionInputFields)
    setCorrectOption(0)

  }

  let handleRemoveOptionField = (index) => {
    if (optionInputFields.length < 3) {
      setOptionInputFieldsCheck(true);
    }
    let currentOptionInputFields = [...optionInputFields];
    currentOptionInputFields.splice(index, 1);
    currentOptionInputFields = currentOptionInputFields.map((currentOptionInputField, key) => {
      return { ...currentOptionInputField, option_no: ++key }
    })
    setOptionInputFields(currentOptionInputFields)
    setCorrectOption(0)
  }

  let handleChangeOptionFieldValue = (index, e) => {
    let currentOptionInputFields = [...optionInputFields];
    currentOptionInputFields[index].option_value = e.target.value;
    currentOptionInputFields[index].check = false;
    setOptionInputFields(currentOptionInputFields)
  }

  let validateField = () => {
    let result = true;
    if (!question || question.trim() == "") {
      setQuestionCheck(true)
      result = false
    }
    // if (!description || description.trim() == "") {
    //   setDescriptionCheck(true)
    //   result=false
    // }
    if (!customEditorRef.current.validateEditorValue()) {
      result = false
    }
    if (!content && !params.id) {
      setContentCheck(true)
      result = false
    }
    // if (!phase || phase == 0) {
    //   setPhaseCheck(true)
    //   result=false
    // }
    // if (!phaseDay || phaseDay == 0) {
    //   setPhaseDayCheck(true)
    //   result=false
    // }

    if (!correctOption || correctOption == 0) {
      setCorrectOptionCheck(true)
      result = false
    }

    let currentOptionInputFields = [...optionInputFields]
    for (let optionInputField of currentOptionInputFields) {
      if (!optionInputField.option_value || optionInputField.option_value.trim() == "") {
        optionInputField.check = true;
        result = false
      }
    }
    setOptionInputFields(currentOptionInputFields);

    if (optionInputFields.length < 2) {
      setOptionInputFieldsCheck(true)
      result = false
    }

    return result
  }


  let handleSubmit = (e) => {
    e.preventDefault();
    if (!validateField()) {
      return
    }
    setSpinnerShow(true)
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })

    console.log("correctOption", correctOption)
    let data = {
      question: question,
      description: `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>${description}</body></html>`,
      phase_id: phase,
      phase_day: phaseDay,
      correct_option: correctOption,
      content_id: content
    }

    optionInputFields.forEach((optionInputField) => {
      if (optionInputField.option_value && optionInputField.option_value.trim() != "") {
        data[`option_${optionInputField.option_no}`] = optionInputField.option_value
      }
    })


    if (params.id) {
      delete data.content_id;
      let req = {
        pathParams: {
          id: params.id,
        },
        data
      }

      editLearningQuiz(req).then((response) => {
        setSpinnerShow(false)
        setErrorResponse({ message: null, code: null, isFound: false })
        setSuccessResponse({ message: "Updated Successfully" || null, code: 200 || null, isFound: true })
        history.push('/listLearning/quiz')
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    } else {
      let req = {
        data
      }
      addLearningQuiz(req).then((response) => {
        setSpinnerShow(false)
        setErrorResponse({ message: null, code: null, isFound: false })
        setSuccessResponse({ message: "Saved Successfully" || null, code: 200 || null, isFound: true })
        history.push('/listLearning/quiz')
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }
  }


  let handleAddAnotherQuestion = () => {
    if (!validateField()) {
      return
    }
    setSpinnerShow(true)
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })

    console.log("correctOption", correctOption)
    let data = {
      question: question,
      description: `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>${description}</body></html>`,
      phase_id: phase,
      phase_day: phaseDay,
      correct_option: correctOption,
      content_id: content
    }

    optionInputFields.forEach((optionInputField) => {
      if (optionInputField.option_value && optionInputField.option_value.trim() != "") {
        data[`option_${optionInputField.option_no}`] = optionInputField.option_value
      }
    })

    let req = {
      data
    }
    addLearningQuiz(req).then((response) => {
      setSpinnerShow(false)
      setErrorResponse({ message: null, code: null, isFound: false })
      setQuestion("")
      setDescription("")
      customEditorRef.current.updateEditorValue()
      setCorrectOption(0)
      setOptionInputFields([
        { option_no: 1, option_value: "", isRequired: false, check: false },
        { option_no: 2, option_value: "", isRequired: false, check: false },
      ])
      setSpinnerShow(false)
      setQuestionCheck(false)
      setDescriptionCheck(false)
      setCorrectOptionCheck(false)
      setSuccessResponse({ message: "Saved Successfully" || null, code: 200 || null, isFound: true })
    }).catch((error) => {
      setSpinnerShow(false)
      setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
    })
  }

  console.log(contentCheck, "contentCheckcontentCheckcontentCheck");

  return (
    <CContainer fluid>
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>{history.location.pathname == "/addLearningQuiz" ? "Add Learning Quiz" : "Edit Learning Quiz"}
                  <CSpinner style={{ color: "#008080", marginLeft: "2rem", display: spinnerShow ? "" : "none" }} /></h2>
                {/* <CButton
                        style={{ width: "5rem",backgroundColor:"#008080",color:"#fff"}}
                        onClick={()=>history.goBack()}
                    >
                        <strong>Back</strong>
                    </CButton> */}
              </div>

            </CCardHeader>
            <CCardBody>
              <div style={{ color: "red", fontSize: "1rem", display: errorResponse.isFound ? "flex" : "none", justifyContent: "center" }}>
                <div><h5>{errorResponse.message}</h5></div>
              </div>
              {/* <div style={{color:"green",fontSize:"1rem", display:successResponse.isFound?"flex":"none", justifyContent:"center"}}>
                  <div><h5>{ successResponse.message}</h5></div>
                </div> */}
              <CToaster
                position="top-right"
                key='toaster'
                style={{ top: "80px" }}
              >
                <CToast
                  color="success"
                  key='toast'
                  show={successResponse.isFound}
                  autohide="5000"
                >
                  {/* <CToastHeader style={{backgroundColor:"#008080",color:"#fff"}} >Info</CToastHeader> */}
                  <CToastBody style={{backgroundColor:"#008080",color:"#fff"}}>
                    <strong>{successResponse.message}</strong>
                  </CToastBody>
                </CToast>
              </CToaster>
              <CForm action="" method="post" onSubmit={handleSubmit} autoComplete="off">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  {!params.id && <CFormGroup style={{ width: "100%" }}>

                    <CLabel style={{ fontWeight: "600", fontSize: "1rem" }} htmlFor="phase">Content:</CLabel>
                    <CSelect
                      onChange={(e) => {
                        setContentCheck(false);
                        setContent(e.target.value);
                      }}
                      value={content}
                      id="contenttype"
                      name="contenttype"
                      custom
                    //required
                    > <option value="0" defaultValue>Select Content</option>
                      {data.map((content) => {
                        return <option key={content.id} value={content.id}> {content.title}</option>
                      })}
                    </CSelect>
                    <div style={{ color: "red", marginLeft: "0.1rem", display: contentCheck ? "" : "none" }}>Content is required</div>
                  </CFormGroup>}
                </div>
                <CFormGroup >
                  <CLabel style={{ fontWeight: "600", fontSize: "1rem" }} htmlFor="question">Question:</CLabel>
                  <CInput
                    onChange={(e) => {
                      setQuestionCheck(false)
                      setQuestion(e.target.value)
                    }}
                    value={question}
                    type="text"
                    id="question"
                    name="question"
                    placeholder="Enter question"
                  //required
                  />
                  <div style={{ color: "red", marginLeft: "0.1rem", display: questionCheck ? "" : "none" }}>Question is required</div>
                </CFormGroup>

                <CFormGroup>
                  <CLabel style={{ fontWeight: "600", fontSize: "1rem" }} htmlFor="option">Options:</CLabel>
                  {optionInputFields.map((optionInputField, index) => {
                    return (<>
                      <CInputGroup style={{ display: "flex", alignItems: "center", marginTop: optionInputField.option_no > 1 ? "0.5rem" : "none" }}>
                        <CInput
                          onChange={(e) => handleChangeOptionFieldValue(index, e)}
                          value={optionInputField.option_value}
                          type="optionInputField"
                          id={`option${optionInputField.option_no}`}
                          name={`option${optionInputField.option_no}`}
                          placeholder={`Enter option ${optionInputField.option_no}`}
                        //required
                        />
                        <CInputGroupAppend style={{ display: optionInputFields.length > 2 ? "" : "none" }}>
                          <CBadge style={{ marginLeft: "0.5rem", cursor: "pointer" }} color="danger" onClick={() => handleRemoveOptionField(index)}><FaMinus /></CBadge>
                        </CInputGroupAppend>
                      </CInputGroup>
                      <div style={{ color: "red", marginLeft: "0.1rem", display: optionInputField.check ? "" : "none" }}>Option {optionInputField.option_no} is required</div>
                    </>
                    )
                  })}
                  <div style={{ color: "red", marginLeft: "0.1rem", display: optionInputFieldsCheck ? "" : "none" }}>Atleast two options are required</div>
                  <CBadge
                    style={{ marginTop: "0.5rem", cursor: "pointer", display: optionInputFields.length < 6 ? "" : "none" }}
                    color="secondary"
                    onClick={handleAddOptionField}
                  ><FaPlus /></CBadge>

                </CFormGroup>

                <CFormGroup >
                  <CLabel style={{ fontWeight: "600", fontSize: "1rem" }} htmlFor="correct_option">Correct Option:</CLabel>
                  <CSelect
                    onChange={(e) => {
                      setCorrectOptionCheck(false)
                      setCorrectOption(e.target.value)
                    }}
                    value={correctOption}
                    id="phase"
                    name="phase"
                  //required
                  > <option value="0" defaultValue>Select Correct Option</option>
                    {optionInputFields.map((optionInputField) => {
                      if (optionInputField.option_value && optionInputField.option_value != "") {
                        return <option key={optionInputField.option_no} value={optionInputField.option_no}> {optionInputField.option_value}</option>
                      } else {
                        return null
                      }
                    })}
                  </CSelect>
                  <div style={{ color: "red", marginLeft: "0.1rem", display: correctOptionCheck ? "" : "none" }}>Correct option is required</div>
                </CFormGroup>

                <CFormGroup >

                  <CLabel style={{ fontWeight: "600", fontSize: "1rem" }} htmlFor="description">Description:</CLabel>
                  {/* <CTextarea
                      onChange={(e) => {
                        setDescriptionCheck(false)
                        setDescription(e.target.value)
                      }}
                      value={description}
                      id="description"
                      name="description"
                          rows="5"
                      placeholder="Enter Answer Description"
                      //required
                    /> */}
                  <CustomEditor
                    {...{
                      description,
                      setDescription,
                      descriptionCheck,
                      setDescriptionCheck,
                    }}
                    ref={customEditorRef}
                  />
                  <div style={{ color: "red", marginLeft: "0.1rem", display: descriptionCheck ? "" : "none" }}>Description is required</div>

                </CFormGroup>


                <CFormGroup style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CButton
                    disabled={spinnerShow}
                    style={{ width: "5rem", marginRight: "3rem", backgroundColor: "#008080", color: "#fff" }}
                    type="submit"
                  >{spinnerShow ? <CSpinner style={{ color: "#fff" }} size="sm" /> : "Save"}</CButton>

                  <CButton
                    disabled={spinnerShow}
                    style={{ width: "13rem", marginLeft: "3rem", marginRight: "3rem", backgroundColor: "#008080", color: "#fff", display: params.id ? "none" : "", }}
                    onClick={handleAddAnotherQuestion}
                  > {spinnerShow ? <CSpinner style={{ color: "#fff" }} size="sm" /> : "Add Another Question"}</CButton>

                  <CButton style={{ width: "5rem", marginLeft: "3rem" }} color="danger" onClick={(e) => history.goBack()} >Cancel</CButton>
                </CFormGroup>

              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )

}

export default AddEditLearningQuiz