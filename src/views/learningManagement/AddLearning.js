import React, { useState} from "react";
import { useHistory,} from "react-router-dom";
import {    
    CCardBody,
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CButton,
} from "@coreui/react"
import CIcon from "@coreui/icons-react";
import AddEditLearningContent from "./AddEditContent";
import AddEditLearningQuiz from "./AddEditQuiz";

function Learning(props) {
    let history = useHistory();
    let [quizButton,setQuizButton] = useState(false);
    let [contentButton, setContentButton] = useState(true);


    
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
                                    onClick={()=>history.goBack()}
                                >
                                    <strong>Back</strong>
                                </CButton>
                            </div>
                                            
                        </CCardHeader>
                        <CCardBody>
                                <div style={{ display: "flex", justifyContent:"center", marginLeft:"1rem",marginBottom:"1rem" }}>
                                <CButton
                                    color={quizButton ? "secondary" : "info"}
                                    style={{width:"12rem", marginLeft:"2rem"}}
                                    onClick={() => {
                                        setContentButton(true)
                                        setQuizButton(false)
                                    }}
                                > <strong>Learning Content</strong>
                                </CButton>
                                <CButton
                                    color={quizButton ? "info" : "secondary"}
                                    style={{width:"12rem", marginLeft:"2rem"}}
                                    onClick={() => {
                                        setContentButton(false)
                                        setQuizButton(true)
                                    }}
                                ><strong>Learning Quiz</strong>
                                </CButton>
                            </div>
                            
                            {quizButton?<AddEditLearningQuiz/>:<AddEditLearningContent/>}

                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
        
    )
}

export default Learning