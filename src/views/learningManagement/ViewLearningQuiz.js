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
  CInput
   
} from "@coreui/react"
import CIcon from "@coreui/icons-react";
import { getLearningQuiz } from "../../data/learningContentManagement"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function ViewLearningQuiz(props) {
  let history = useHistory();
  let params = useParams();

let [question,setQuestion ] = useState("");
  let [description,setDescription] = useState("");
  let [phase,setPhase] = useState("");
  let [phaseDay, setPhaseDay] = useState(1);
  let [ correctOption,setCorrectOption ] = useState("");
  let [errorResponse, setErrorResponse] = useState({
        message: null,
        code: null,
        isFound: false,
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
    "Kickstart",
   "Phase 1",
   "Phase 2",
    "Phase 3",
   "Phase 4",
    "Phase 4 EVA"
  ]


  let [spinnerShow,setSpinnerShow]=useState(false)

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
        setPhase(phases[response.quizDetails.phase_id-1])
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
        let answer = currentOptionInputFields.find((optionInputField) => optionInputField.option_no == response.quizDetails.correct_option)
          console.log(answer)
          if (answer) {
            console.log(answer)
            setCorrectOption(answer.option_value)
          }
          setSpinnerShow(false)
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }
  }, [])
    

    return (
    <CContainer fluid>
      <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                  <h2>
                    View Learning Quiz
                    <CSpinner style={{color:"#008080", marginLeft:"2rem", display:spinnerShow?"":"none"}} /></h2>
                 
                  <CButton
                        
                        style={{ backgroundColor: "gray" }}
                        onClick={()=>history.goBack()}
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
              <CCardBody >
                <div style={{color:"red",fontSize:"1rem", display:errorResponse.isFound?"flex":"none", justifyContent:"center"}}>
                  <div><h5>{ errorResponse.message}</h5></div>
                </div>
                <div style={{display:"flex", justifyContent:"center"}} >                 
                
                  <table cellpadding="12" cellSpacing="10">
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="question">Question</CLabel></td>
                          <td>:</td>
                      <td>{question}</td>
                      </tr>
                      <tr>
                          <td><CLabel style={{ fontWeight: "600", fontSize: "1rem" }} htmlFor="option">Options:</CLabel></td>
                          <td>:</td>
                      <td>{optionInputFields.map((optionInputField,index) => {
                      return(
                      <CInputGroup style={{display:"flex",alignItems:"center",marginTop:optionInputField.option_no>1?"0.5rem":"none"}}>
                         <CInput
                              value={optionInputField.option_value}
                              type="optionInputField"
                              placeholder={`Enter option ${optionInputField.option_no}`}
                          />                          
                      </CInputGroup>)
                    })}</td>
                    </tr>
                    <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="correct_option">Corrent Option:</CLabel></td>
                          <td>:</td>
                      <td>{correctOption}</td>
                      </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="description">Description</CLabel></td>
                          <td>:</td>
                      <td> <CTextarea
                      value={description}
                      id="description"
                      name="description"
                        rows="5"
                        cols="80"
                      placeholder="Enter Description"
                      required
                  /></td>
                      </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="phase">Phase</CLabel></td>
                          <td>:</td>
                      <td>{phase}</td>
                      </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="phase">Phase Day</CLabel></td>
                          <td>:</td>
                      <td>{phaseDay}</td>
                      </tr>
                    
                  </table>
                  </div>
              </CCardBody>
            </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
  
}

export default ViewLearningQuiz