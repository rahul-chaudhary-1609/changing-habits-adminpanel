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
    let quizButton = false;
    let contentButton=true

    if (props.match.params.type == "quiz") {
        quizButton = true
        contentButton=false
    } else {
        contentButton = true
        quizButton = false
    }
    
    return (
        <CContainer>
            <CRow>
                <CCol sm="12">
                    <CCard>
                        <CCardHeader>
                            {/* <div style={{display:"flex", justifyContent:"space-between"}}> */}
                                <h2>Today's Learning Management</h2>
                                <CButton
                                    style={{ width: "5rem", float:"right", backgroundColor:"#008080",color:"#fff"}}
                                    onClick={()=>quizButton? history.push('/addLearningQuiz'):history.push('/addLearningContent')}
                                >
                                    <strong>Add</strong>
                                </CButton>
                            {/* </div> */}
                                            
                        </CCardHeader>
                        <CCardBody>
                                <div style={{ display: "flex", justifyContent:"center", marginLeft:"1rem",marginBottom:"2rem" }}>
                                
                                <CButton
                                    style={{width:"12rem", marginLeft:"2rem", backgroundColor:quizButton ? "gray":"#008080", color:"#fff"}}
                                    onClick={() => {
                                        history.push('/listLearning/content')
                                    }}
                                > <strong>Learning Content</strong>
                                </CButton>
                                <CButton
                                    style={{width:"12rem", marginLeft:"2rem",backgroundColor:quizButton ? "#008080" : "gray",color:"#fff"}}
                                    onClick={() => {
                                        history.push("/listLearning/quiz")
                                    }}
                                ><strong>Learning Quiz</strong>
                                </CButton>
                            </div>
                            
                            {quizButton?<ListLearningQuiz/>:<ListLearningContent/>}

                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
        
    )
}

export default Learning