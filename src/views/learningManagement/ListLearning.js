import React, { useState, useEffect, useRef } from "react";
import { Route, useHistory, Link} from "react-router-dom";
import {    
    CInputGroupText,
    CCardBody,
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CButton,
} from "@coreui/react"
import CIcon from "@coreui/icons-react";
import ListLearningContent from "./ListContent";
import ListLearningQuiz from "./ListQuiz";

function Learning(props) {
    let history = useHistory();
    let quizRadioButton = false;
    let contentRadioButton=true

    console.log(props.match.params.type);
    if (props.match.params.type == "quiz") {
        quizRadioButton = true
        contentRadioButton=false
    } else {
        contentRadioButton = true
        quizRadioButton = false
    }
    
    return (
        <CContainer>
            <CRow>
                <CCol sm="12">
                    <CCard>
                        <CCardHeader>
                            <div style={{display:"flex", justifyContent:"space-between"}}>
                                <h2>Today's Learning Management</h2>
                                <CButton
                                    color="success"
                                    style={{ width: "5rem",}}
                                    onClick={()=>history.push('/addLearning')}
                                >
                                    <strong>Add</strong>
                                </CButton>
                            </div>
                                            
                        </CCardHeader>
                        <CCardBody>
                                <div style={{ display: "flex", justifyContent:"center", marginLeft:"1rem",marginBottom:"1rem" }}>
                                <CInputGroupText style={{ marginLeft: "1rem", cursor:"pointer" }}
                                    onClick={() => {
                                        history.push('/listLearning/content')
                                    }}
                                >
                                    <CIcon style={{ marginRight: "1rem" }} name="cilList"/>
                                    Learning Content
                                    <input style={{ marginLeft: "1rem" }}
                                        type="radio"
                                        checked={contentRadioButton}
                                    />
                                </CInputGroupText>  
                                <CInputGroupText style={{ marginLeft: "1rem", cursor:"pointer" }}
                                    onClick={() => {
                                        history.push("/listLearning/quiz")
                                        
                                    }}
                                >
                                    <CIcon style={{ marginRight: "1rem" }} name="cilPuzzle"/>
                                    Learning Quiz
                                    <input style={{ marginLeft: "1rem" }}
                                        type="radio"
                                        checked={quizRadioButton}
                                    />
                                </CInputGroupText>                                   
                            </div>
                            
                            {quizRadioButton?<ListLearningQuiz/>:<ListLearningContent/>}

                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
        
    )
}

export default Learning