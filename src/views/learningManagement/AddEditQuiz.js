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
  CBadge
} from "@coreui/react"
import CIcon from "@coreui/icons-react";
import {getPhaseDays,getLearningQuiz,addLearningQuiz,editLearningQuiz} from "../../data/learningContentManagement"

function AddEditLearningQuiz() {
  let history = useHistory();
  let params = useParams();

let [question,setQuestion ] = useState("");
  let [description,setDescription] = useState("");
  let [phase,setPhase] = useState(1);
  let [phaseDay, setPhaseDay] = useState(1);
  let [ correctOption,setCorrectOption ] = useState(1);
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
      { option_no: 1, option_value: "",isRequired:true },
      { option_no: 2, option_value: "",isRequired:true },
      { option_no: 3, option_value: "",isRequired:true },
      { option_no: 4, option_value: "",isRequired:true },
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
        
      }).catch((error) => {
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }
  }, [])
  
    
  useEffect(() => {
    let req = {
        pathParams: {
            id: phase,
        },
    }
    getPhaseDays(req).then((response) => {
      let newPhaseDaysList = []
      for (let i = 1; i <= response.phaseDays; i++){
        newPhaseDaysList.push(i)
      }
      setPhaseDaysList([...newPhaseDaysList]);
      setErrorResponse({ message: null, code: null, isFound: false })
    }).catch((error) => {
      setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
    })
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

  let handleChangeOptionFieldValue = (index,e) => {
    let currentOptionInputFields = [...optionInputFields];
    currentOptionInputFields[index].option_value = e.target.value;
    setOptionInputFields(currentOptionInputFields)
  }


  let handleSubmit = (e) => {
    e.preventDefault();
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })

    
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
        setErrorResponse({ message: null, code: null, isFound: false })
        setSuccessResponse({ message:"Updated Successfully" || null, code: 200 || null, isFound: true })
      }).catch((error) => {
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    } else {
      let req = {
        data
      }
      addLearningQuiz(req).then((response) => {
        setErrorResponse({ message: null, code: null, isFound: false })
        setSuccessResponse({ message:"Saved Successfully" || null, code: 200 || null, isFound: true })
        //history.push('/listLearning/quiz')
      }).catch((error) => {
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }    
  }

  let handleReset = (e) => {
    e.preventDefault();
    setQuestion("")
    setDescription("")
    setPhase(1)
    setPhaseDay(1)
    setPhaseDaysList([])
    setCorrectOption(1)
    setOptionInputFields([
      { option_no: 1, option_value: "",isRequired:true },
      { option_no: 2, option_value: "",isRequired:true },
      { option_no: 3, option_value: "",isRequired:true },
      { option_no: 4, option_value: "",isRequired:true },
    ])
    
  }

    return (
    <CContainer fluid>
      <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                    <h2>{history.location.pathname=="/addLearningQuiz"?"Add Learning Quiz":"Edit Learning Quiz"}</h2>
                    <CButton
                        color="success"
                        style={{ width: "5rem"}}
                        onClick={()=>history.goBack()}
                    >
                        <strong>Back</strong>
                    </CButton>
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
                      onChange={(e) => setQuestion(e.target.value)}
                      value={question}
                      type="text"
                      id="question"
                      name="question"
                      placeholder="Enter question"
                      required
                    />                    
                  </CFormGroup>

                  <CFormGroup>
                    <CLabel style={{ fontWeight: "600", fontSize: "1rem" }} htmlFor="option">Option:</CLabel>
                    {optionInputFields.map((optionInputField,index) => {
                      return(
                      <CInputGroup style={{display:"flex",alignItems:"center",marginTop:optionInputField.option_no>1?"0.5rem":"none"}}>
                         <CInput
                              onChange={(e) => handleChangeOptionFieldValue(index,e)}
                              value={optionInputField.option_value}
                              type="optionInputField"
                              id={`option${optionInputField.option_no}`}
                              name={`option${optionInputField.option_no}`}
                              placeholder={`Enter option ${optionInputField.option_no}`}
                              required
                          />                          
                          <CInputGroupAppend style={{display:optionInputField.isRequired?"none":"block"}}>                              
                                  <CButton onClick={()=>handleRemoveOptionField(index)}><CBadge color="danger">Remove</CBadge></CButton>
                          </CInputGroupAppend>
                      </CInputGroup>)
                    })}
                  <CButton style={{marginTop:"0.5rem"}} color="secondary" onClick={handleAddOptionField}>Add</CButton>
                          
                  </CFormGroup>

                  <CFormGroup >                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="correct_option">Corrent Option:</CLabel>
                    <CSelect
                      onChange={(e)=>setCorrectOption(e.target.value)}
                      value={correctOption}
                      id="phase"
                      name="phase"
                      required
                    > <option value="" defaultValue disabled>Select Correct Option</option>
                      {optionInputFields.map((optionInputField) => {
                        if (optionInputField.option_value && optionInputField.option_value != "") {
                          return <option key={optionInputField.option_no} value={optionInputField.option_no}> {optionInputField.option_value}</option>
                        } else {
                          return null
                        }
                    })}
                    </CSelect>                 
                  </CFormGroup>
                  
                  <CFormGroup >
                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="description">Description:</CLabel>
                    <CTextarea
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      id="description"
                      name="description"
                          rows="5"
                      placeholder="Enter Answer Description"
                      required
                        />       
                    
                  </CFormGroup>
                  <div style={{display:"flex", justifyContent:"space-between"}}>
                  <CFormGroup style={{width:"45%"}}>
                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="phase">Phase:</CLabel>
                    <CSelect
                      onChange={(e)=>setPhase(e.target.value)}
                      value={phase}
                      id="phase"
                      name="phase"
                      required
                    > <option value="" defaultValue disabled>Select Phase</option>
                      {phases.map((phase) => {
                        return <option key={phase.id} value={phase.id}> {phase.name}</option>
                    })}
                    </CSelect>                   
                  </CFormGroup>
                  
                  <CFormGroup style={{width:"45%"}}>
                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="phase_day">Phase Day:</CLabel>
                    <CSelect
                      onChange={(e) => setPhaseDay(e.target.value)}
                      value={phaseDay}
                      id="phase_day"
                      name="phase_day"
                      required
                    > <option value="" defaultValue disabled>Select Day</option>
                      {phaseDaysList.map((day) => {
                        return <option key={day} value={day}> {day}</option>
                    })}
                    </CSelect>  
                    </CFormGroup>
                    </div>
                  
                  <CFormGroup style={{display:"flex", alignItems:"center", justifyContent:"space-around"}}>
                    <CButton style={{width:"10rem"}} color="success" type="submit" >Save</CButton>
                    <CButton style={{width:"10rem"}} type="reset" color="secondary" onClick={handleReset} >Reset</CButton>
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