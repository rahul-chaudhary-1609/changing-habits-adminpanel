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
  CFormText,
   
} from "@coreui/react"
import Select from 'react-select';
import { sendNotification,listActiveUser } from "src/data/notificationManagement";
import {CustomEditor} from "src/utils/components/customEditor";
import {ConfirmNotificationModal} from "src/utils/components/modal"

function SendNotification(props) {
  let history = useHistory();
  let customEditorRef=useRef()

  let [title, setTitle] = useState("");
  let [titleCheck,setTitleCheck ] = useState(false);
  let [description, setDescription] = useState("");
  let [descriptionCheck,setDescriptionCheck] = useState(false);
  let [user, setUser] = useState([]);
  let [subscriptionStatus, setSubscriptionStatus] = useState(-1);
  let [userCheck, setUserCheck] = useState(false);  
  let [userList, setUserList] = useState([]);
  let [selectAll,setSelectAll]=useState(false);
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

  let subscriptionStatusList=[
    {
      id:0,
      name:"Free"
    },
    {
      id:1,
      name:"Paid"
    },
  ]


  let [spinnerShow,setSpinnerShow]=useState(false)
  let [modal,setModal]=useState(false);

  useEffect(() => {
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })
  },[title,description,user])
    
  
    useEffect(() => {
        let req = {
            queryParams: {
              subscription_type:subscriptionStatus==-1?null:subscriptionStatus,
            }
        }
        setSpinnerShow(true)
        listActiveUser(req).then((response) => {
            setSpinnerShow(false)
            

            setUserList(response.activeUsers.map((user)=>{
              return {
               ...user,
               value:user.id,
               label:`${user.name} (${user.email})`
             }
           }))
        }).catch((error) => {
            setSpinnerShow(false)
            setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
        })

    },[subscriptionStatus])

  let toggleModal=()=>{
    setModal(!modal);
  }

  
  let validateField = () => {
    let result = true;
    if (!title || title.trim() == "") {
      setTitleCheck(true)
      result=false
    }
    // if (!description || description.trim() == "") {
    //   setDescriptionCheck(true)
    //   result=false
    // }
    if(!customEditorRef.current.validateEditorValue()){
      result=false
    }
    if (user.length==0 && !selectAll) {
      setUserCheck(true)
      result=false
    }

    return result
  }

  let handleSend=(e)=>{
    e.preventDefault();
    if (!validateField()) {
      return
    }
    toggleModal();
  }

  let handleSubmit = () => {
    setSpinnerShow(true)
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })
    
    
    let req={
      data : {
        title: title,
        description: description,      
      }
    } 
    
    if(subscriptionStatus==0 || subscriptionStatus==1){
      if(selectAll){
        req.data.user_ids=userList.map(user=>user.id);
      }else{
        req.data.user_ids=user.map(user=>user.id);
      }
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
      <ConfirmNotificationModal
            {...{
              modal,
              toggleModal,
              info:"Notification",
              title,
              description,
              user,
              userList,
              selectAll,
              subscriptionStatus,
              onYesAction:handleSubmit,
            }}
      />
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
                  <CForm action="" method="post" onSubmit={handleSend}  autoComplete="off">
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
                    {/* <CTextarea
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
                        />        */}
                        <CustomEditor
                          {...{
                            description,
                            setDescription,
                            descriptionCheck,
                            setDescriptionCheck
                          }}
                          ref={customEditorRef}
                      />
                    <div style={{color:"red",marginLeft:"0.1rem", display:descriptionCheck?"":"none"}}>Description is required</div>
                  </CFormGroup>
                  <div style={{display:"flex", justifyContent:"space-between"}}>
                        <div style={{width:"45%"}}>
                        <CFormGroup >
                    
                        <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="user">Subscripton Type:</CLabel>
                          <CSelect
                              onChange={(e) => {
                                setUser([])
                                setSelectAll(false)
                                setSubscriptionStatus(e.target.value)
                              }}
                            value={subscriptionStatus}
                            id="user"
                              name="user"
                              custom
                            //required
                          > <option value={-1} defaultValue>All Type</option>
                            {subscriptionStatusList.map((subscriptionStatus,index) => {
                              return <option key={index} value={subscriptionStatus.id}> {subscriptionStatus.name}</option>
                          })}
                            </CSelect>
                          </CFormGroup>
                        </div>
                      <div style={{width:"45%"}}>
                      <CFormGroup >
                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="user">User:</CLabel>
                        <div style={{display:"flex",justifyContent:"space-between", alignItems:"center",marginLeft:"1.5rem"}}>
                          <div style={{width:"10%",}}>
                            <CLabel><CInputCheckbox
                                checked={selectAll}
                                onChange={(e)=>{
                                  console.log(selectAll)
                                  setUser([])
                                  setUserCheck(false)
                                  setSelectAll(!selectAll)
                                }}
                            /> All</CLabel>
                          </div>
                          <div style={{width:"90%"}}>
                              <Select 
                                options={userList}
                                isMulti
                                placeholder="Select User"
                                onChange={(e) => {
                                  console.log(e)
                                  setUserCheck(false)
                                  setUser(e)
                                }}
                                value={user}
                                isDisabled={selectAll}
                            />
                          </div>
                        </div>                          
                        <div style={{color:"red",marginLeft:"0.1rem", display:userCheck?"":"none"}}>User is required</div>  
                        </CFormGroup>
                      </div>
                </div>
                  
                  <CFormGroup style={{display:"flex", alignItems:"center", justifyContent:"center",marginTop:"1rem"}}>
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