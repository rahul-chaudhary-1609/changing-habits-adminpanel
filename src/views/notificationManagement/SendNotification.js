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
import { sendNotification,listUser } from "src/data/notificationManagement";


function SendNotification(props) {
  let history = useHistory();

  let [title, setTitle] = useState("");
  let [titleCheck,setTitleCheck ] = useState(false);
  let [description, setDescription] = useState("");
  let [descriptionCheck,setDescriptionCheck] = useState(false);
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

  
  let validateField = () => {
    let result = true;
    if (!title || title.trim() == "") {
      setTitleCheck(true)
      result=false
    }
    if (!description || description.trim() == "") {
      setDescriptionCheck(true)
      result=false
    }
    if (!user || user == null) {
      setUserCheck(true)
      result=false
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
    
    
    let data = {
      title: title,
      description: description,      
    }
    // if (mediaInput.type == "image" || mediaInput.type == "video") {
    //   data[`${mediaInput.type}_url`]=mediaInput.source
    // }

    let req = {
      pathParams: {
          id: user,
        },
      data
    }
    sendNotification(req).then((response) => {
    setSpinnerShow(false)
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message:"Saved Successfully" || null, code: 200 || null, isFound: true })
    history.push('/listNotification')
    }).catch((error) => {
    setSpinnerShow(false)
    setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
    })

    
  }

    return (
    <CContainer fluid>
      <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                  <h2>
                    Send Notification
                  <CSpinner style={{color:"#008080", marginLeft:"2rem", display:spinnerShow?"":"none"}} /></h2>
                    {/* <CButton
                        
                        style={{ width: "5rem",backgroundColor:"#008080",color:"#fff" }}
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
                  <CForm action="" method="post" onSubmit={handleSubmit}  autoComplete="off">
                  <CFormGroup >                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="title">Title:</CLabel>
                    <CInput
                      onChange={(e) => {
                        setTitleCheck(false)
                        setTitle(e.target.value)
                      }}
                      value={title}
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Enter Title"
                      //required
                    />
                    <div style={{color:"red",marginLeft:"0.1rem", display:titleCheck?"":"none"}}>Title is required</div>
                      </CFormGroup>
                   
                  <CFormGroup >
                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem",}} htmlFor="description">Description:</CLabel>
                    <CTextarea
                      onChange={(e) => {
                        setDescriptionCheck(false)
                        setDescription(e.target.value)
                      }}
                      value={description}
                      id="description"
                      name="description"
                          rows="5"
                          type="text"
                          id="title"
                          name="title"
                      placeholder="Enter Description"
                      //required
                        />       
                    <div style={{color:"red",marginLeft:"0.1rem", display:descriptionCheck?"":"none"}}>Description is required</div>
                  </CFormGroup>
                  
                  <CFormGroup >
                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="user">Select User:</CLabel>
                    <CSelect
                        onChange={(e) => {
                          setUserCheck(false)
                          setUser(e.target.value)
                        }}
                      value={user}
                      id="user"
                        name="user"
                        custom
                      //required
                    > <option value={null} defaultValue>Select User</option>
                      <option  value="0" >All Users</option>
                      {userList.map((user,index) => {
                        return <option key={index} value={user.id}> {user.name} ( {user.email} )</option>
                    })}
                      </CSelect>
                    <div style={{color:"red",marginLeft:"0.1rem", display:userCheck?"":"none"}}>User is required</div>  
                    </CFormGroup>
                   
                  
                  
                  
                  <CFormGroup style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                    <CButton
                      disabled={spinnerShow}
                      style={{ width: "5rem", marginRight:"3rem", backgroundColor: "#008080", color: "#fff" }}
                      type="submit"
                    >{spinnerShow?<CSpinner style={{ color: "#fff"}} size="sm" />:"Send"}</CButton>
                    <CButton style={{width:"5rem",marginLeft:"3rem",}} color="danger" onClick={(e)=>history.goBack()} >Cancel</CButton>
                  </CFormGroup>
                  
                  </CForm>
              </CCardBody>
            </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
  
}

export default SendNotification