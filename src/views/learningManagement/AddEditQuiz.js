import React, { useState, useEffect, useRef } from "react";
import { useHistory,useParams } from "react-router-dom";
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
  CSpinner
} from "@coreui/react"
import { FaPlus,FaMinus } from 'react-icons/fa';
import {getPhaseDays,getLearningQuiz,addLearningQuiz,editLearningQuiz} from "../../data/learningContentManagement"

function AddEditLearningQuiz() {
  let history = useHistory();
  let params = useParams();

  let [question, setQuestion] = useState("");
  let [questionCheck,setQuestionCheck ] = useState(false);
  let [description, setDescription] = useState("");
  let [descriptionCheck,setDescriptionCheck] = useState(false);
  let [phase,setPhase] = useState(0);
  let [phaseCheck,setPhaseCheck] = useState(false);
  let [phaseDay, setPhaseDay] = useState(0);
  let [phaseDayCheck, setPhaseDayCheck] = useState(false);
  let [correctOption, setCorrectOption] = useState(0);
  let [ correctOptionCheck,setCorrectOptionCheck ] = useState(false);
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
      { option_no: 1, option_value: "",isRequired:true,check:false },
      { option_no: 2, option_value: "",isRequired:true,check:false },
      { option_no: 3, option_value: "",isRequired:true,check:false },
      { option_no: 4, option_value: "",isRequired:true,check:false },
    ]
  )

  let phases = [
    {
      id: 1,
      name:"Kickstart"
    },
    {
      id: 2,
      name:"Phase 1"
    },
    {
      id: 3,
      name:"Phase 2"
    },
    {
      id: 4,
      name:"Phase 3"
    },
    {
      id: 5,
      name:"Phase 4"
    },
    {
      id: 6,
      name:"Phase 4 EVA"
    }
    
  ]

  let [phaseDaysList, setPhaseDaysList] = useState([]);
  let [spinnerShow,setSpinnerShow]=useState(false)

  useEffect(() => {
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })
  },[question,description,phase,phaseDay,phaseDaysList,correctOption,optionInputFields])

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
        setPhase(response.quizDetails.phase_id)
        setPhaseDay(response.quizDetails.phase_day)
        let currentOptionInputFields = [
          { option_no: 1, option_value:response.quizDetails.option_1 ,isRequired:true },
          { option_no: 2, option_value: response.quizDetails.option_2,isRequired:true },
          { option_no: 3, option_value: response.quizDetails.option_3,isRequired:true },
          { option_no: 4, option_value: response.quizDetails.option_4,isRequired:true },
        ];
        if (response.quizDetails.option_5) {
          currentOptionInputFields.push({ option_no: 5, option_value:response.quizDetails.option_5 ,isRequired:false })
        }
        if (response.quizDetails.option_6) {
          currentOptionInputFields.push({ option_no: 6, option_value:response.quizDetails.option_6 ,isRequired:false })
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
        for (let i = 1; i <= response.phaseDays; i++) {
          newPhaseDaysList.push(i)
        }
        setPhaseDaysList([...newPhaseDaysList]);
        setErrorResponse({ message: null, code: null, isFound: false })
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }else {
      setPhaseDaysList([]);
    }
  }, [phase])

  let handleAddOptionField = () => {
    if (optionInputFields.length < 6) {
      let currentOptionInputFields = [...optionInputFields];
      currentOptionInputFields.push({ option_no: currentOptionInputFields.length + 1, option_value: "", isRequired: false })
      setOptionInputFields(currentOptionInputFields)
    } else {
      setErrorResponse({ message: "Maximum 6 options are allowed", code: null, isFound: true })
    }
  }

  let handleRemoveOptionField = (index) => {
      let currentOptionInputFields = [...optionInputFields];
      currentOptionInputFields.splice(index, 1);
      setOptionInputFields(currentOptionInputFields)
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
      result=false
    }
    if (!description || description.trim() == "") {
      setDescriptionCheck(true)
      result=false
    }
    if (!phase || phase == 0) {
      setPhaseCheck(true)
      result=false
    }
    if (!phaseDay || phaseDay == 0) {
      setPhaseDayCheck(true)
      result=false
    }

    if (!correctOption || correctOption == 0) {
      setCorrectOptionCheck(true)
      result=false
    }

    optionInputFields.forEach((optionInputField) => {
      if (!optionInputField.option_value || optionInputField.option_value.trim() == "") {
        optionInputField.check = true;
        result=false
      }
    })
    

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

    console.log("correctOption",correctOption)
    let data = {
      question: question,
      description: description,
      phase_id: phase,
      phase_day: phaseDay,
      correct_option:correctOption,
    }

    optionInputFields.forEach((optionInputField) => {
      data[`option_${optionInputField.option_no}`]=optionInputField.option_value
    })
    
    
    if (params.id) {
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
        setSuccessResponse({ message:"Saved Successfully" || null, code: 200 || null, isFound: true })
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

    console.log("correctOption",correctOption)
    let data = {
      question: question,
      description: description,
      phase_id: phase,
      phase_day: phaseDay,
      correct_option:correctOption,
    }

    optionInputFields.forEach((optionInputField) => {
      data[`option_${optionInputField.option_no}`]=optionInputField.option_value
    })
    
    
    if (params.id) {
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
        //history.push('/listLearning/quiz')
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
        setSuccessResponse({ message:"Saved Successfully" || null, code: 200 || null, isFound: true })
        //history.push('/listLearning/quiz')
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }    
  }

  // let handleReset = (e) => {
  //   e.preventDefault();
  //   setQuestion("")
  //   setDescription("")
  //   setPhase(1)
  //   setPhaseDay(1)
  //   setPhaseDaysList([])
  //   setCorrectOption(1)
  //   setOptionInputFields([
  //     { option_no: 1, option_value: "",isRequired:true,check:false },
  //     { option_no: 2, option_value: "",isRequired:true,check:false },
  //     { option_no: 3, option_value: "",isRequired:true,check:false },
  //     { option_no: 4, option_value: "",isRequired:true,check:false },
  //   ])
  //   setSpinnerShow(false)
  //   setQuestionCheck(false)
  //   setDescriptionCheck(false)
  //   setPhaseCheck(false)
  //   setPhaseDayCheck(false)
  //   setCorrectOptionCheck(false)
    
  // }

    return (
    <CContainer fluid>
      <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                  <h2>{history.location.pathname == "/addLearningQuiz" ? "Add Learning Quiz" : "Edit Learning Quiz"}
                  <CSpinner style={{color:"#008080", marginLeft:"2rem", display:spinnerShow?"":"none"}} /></h2>
                    {/* <CButton
                        style={{ width: "5rem",backgroundColor:"#008080",color:"#fff"}}
                        onClick={()=>history.goBack()}
                    >
                        <strong>Back</strong>
                    </CButton> */}
                </div>
                                            
              </CCardHeader>
              <CCardBody>
                <div style={{color:"red",fontSize:"1rem", display:errorResponse.isFound?"flex":"none", justifyContent:"center"}}>
                  <div><h5>{ errorResponse.message}</h5></div>
                </div>
                <div style={{color:"green",fontSize:"1rem", display:successResponse.isFound?"flex":"none", justifyContent:"center"}}>
                  <div><h5>{ successResponse.message}</h5></div>
                  </div>
                  <CForm action="" method="post" onSubmit={handleSubmit}>
                  <CFormGroup >                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="question">Question:</CLabel>
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
                    <div style={{color:"red",marginLeft:"0.1rem", display:questionCheck?"":"none"}}>Question is required</div>
                  </CFormGroup>

                  <CFormGroup>
                    <CLabel style={{ fontWeight: "600", fontSize: "1rem" }} htmlFor="option">Options:</CLabel>
                    {optionInputFields.map((optionInputField, index) => {
                      return (<>
                      <CInputGroup style={{display:"flex",alignItems:"center",marginTop:optionInputField.option_no>1?"0.5rem":"none"}}>
                         <CInput
                              onChange={(e) => handleChangeOptionFieldValue(index,e)}
                              value={optionInputField.option_value}
                              type="optionInputField"
                              id={`option${optionInputField.option_no}`}
                              name={`option${optionInputField.option_no}`}
                              placeholder={`Enter option ${optionInputField.option_no}`}
                              //required
                          />                          
                          <CInputGroupAppend style={{display:optionInputField.isRequired?"none":"block"}}>                              
                                <CBadge style={{marginLeft:"0.5rem", cursor:"pointer"}} color="danger" onClick={()=>handleRemoveOptionField(index)}><FaMinus/></CBadge>
                          </CInputGroupAppend>
                        </CInputGroup>
                        <div style={{ color: "red", marginLeft: "0.1rem", display: optionInputField.check ? "" : "none" }}>Option { optionInputField.option_no} is required</div>
                      </>
                      )
                    })}
                    <CBadge
                      style={{ marginTop: "0.5rem", cursor: "pointer",display:optionInputFields.length<6?"":"none" }}
                      color="secondary"
                      onClick={handleAddOptionField}
                    ><FaPlus /></CBadge>
                          
                  </CFormGroup>

                  <CFormGroup >                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="correct_option">Correct Option:</CLabel>
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
                    <div style={{color:"red",marginLeft:"0.1rem", display:correctOptionCheck?"":"none"}}>Correct option is required</div>
                  </CFormGroup>
                  
                  <CFormGroup >
                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="description">Description:</CLabel>
                    <CTextarea
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
                    />
                    <div style={{color:"red",marginLeft:"0.1rem", display:descriptionCheck?"":"none"}}>Description is required</div>
                    
                  </CFormGroup>
                  <div style={{display:"flex", justifyContent:"space-between"}}>
                  <CFormGroup style={{width:"45%"}}>
                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="phase">Phase:</CLabel>
                    <CSelect
                        onChange={(e) => {
                          setPhaseCheck(false)
                          setPhase(e.target.value)
                        }}
                      value={phase}
                      id="phase"
                        name="phase"
                        custom
                      //required
                    > <option value="0" defaultValue>Select Phase</option>
                      {phases.map((phase) => {
                        return <option key={phase.id} value={phase.id}> {phase.name}</option>
                    })}
                      </CSelect>
                    <div style={{color:"red",marginLeft:"0.1rem", display:phaseCheck?"":"none"}}>Phase is required</div>  
                  </CFormGroup>
                  
                  <CFormGroup style={{width:"45%"}}>
                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="phase_day">Phase Day:</CLabel>
                    <CSelect
                        onChange={(e) => {
                          setPhaseDayCheck(false)
                          setPhaseDay(e.target.value)
                        }}
                      value={phaseDay}
                      id="phase_day"
                        name="phase_day"
                        custom
                      //required
                    > <option value="" defaultValue disabled>Select Day</option>
                      {phaseDaysList.map((day) => {
                        return <option key={day} value={day}> {day}</option>
                    })}
                      </CSelect>
                      <div style={{color:"red",marginLeft:"0.1rem", display:phaseDayCheck?"":"none"}}>Phase day is required</div>
                    </CFormGroup>
                    </div>
                  
                  <CFormGroup style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                    <CButton
                      disabled={spinnerShow}
                      style={{ width: "10rem", marginRight:"3rem",backgroundColor: "#008080", color: "#fff" }}
                      type="submit"
                    >Save <CSpinner style={{ color: "#fff", marginLeft: "1rem", display: spinnerShow ? "" : "none" }} size="sm" /></CButton>
                    
                    <CButton      
                      disabled={spinnerShow}
                      style={{ width: "15rem",marginLeft:"3rem", marginRight: "3rem", backgroundColor: "#008080", color: "#fff", display: params.id ? "none":"", }}
                      onClick={handleAddAnotherQuestion}
                    >Add Another Question <CSpinner style={{ color: "#fff", marginLeft: "1rem", display: spinnerShow ? "" : "none" }} size="sm" /></CButton>
                    
                    <CButton style={{width:"10rem",marginLeft:"3rem"}} color="danger" onClick={(e)=>history.goBack()} >Cancel</CButton>
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