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
  CInputCheckbox,
  CInputFile,
  CSpinner,
  CFormText
   
} from "@coreui/react"
import { sendNotification, listUser } from "src/data/notificationManagement";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";


function ViewNotification(props) {
  let history = useHistory();

  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [user, setUser] = useState(null);
    let [userCheck, setUserCheck] = useState(false);
    
    let [userList, setUserList] = useState([]);
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


  let [spinnerShow,setSpinnerShow]=useState(false)

  useEffect(() => {
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })
  },[title,description,user])
    
  
    useEffect(() => {
        setSpinnerShow(true)
        listUser().then((response) => {
            setSpinnerShow(false)
            setUserList(response.activeUsers)
        }).catch((error) => {
            setSpinnerShow(false)
            setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
        })

    },[])



  


    return (
    <CContainer fluid>
      <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                  <h2>
                    View Notification
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
                            Work in progress...
                {/* <div style={{color:"red",fontSize:"1rem", display:errorResponse.isFound?"flex":"none", justifyContent:"center"}}>
                  <div><h5>{ errorResponse.message}</h5></div>
                </div>
                <div style={{display:"flex", justifyContent:"center"}} >                 
                
                                <table cellpadding="12" cellSpacing="10">
                                    <tr>
                      <td><CLabel style={{ fontWeight: "600", fontSize: "1rem" }} htmlFor="title">Title:</CLabel></td>
                     <td>:</td>
                      <td>{title}</td>
                                    </tr>
                            <tr>
                    <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="description">Description</CLabel></td>
                    <td>:</td>
                    <td >{ description}</td>
                      </tr>
                    <tr>
                    <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="sent_to">Sent To</CLabel></td>
                    <td>:</td>
                      <td><span style={{fontWeight:"500"}}>{ item.type==0?"All Users":"Individual User: "}</span>{ item.type==0?null:`${item.sent_to}`}</td>
                      </tr> </table>
                  </div> */}
              </CCardBody>
            </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
  
}

export default ViewNotification