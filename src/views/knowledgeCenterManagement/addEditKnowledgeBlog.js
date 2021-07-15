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
import CIcon from "@coreui/icons-react";
import { upload } from "../../data/upload";
import MediaView from "src/utils/components/mediaView";
import {getBlog,addBlog,editBlog} from "../../data/knowledgeCenterManagement"


function AddEditKnowledgeBlog(props) {
  let history = useHistory();
  let params = useParams();

  let [title, setTitle] = useState("");
  let [titleCheck,setTitleCheck ] = useState(false);
  let [description, setDescription] = useState("");
  let [descriptionCheck,setDescriptionCheck] = useState(false);
  let [phase, setPhase] = useState(0);
  let [phaseCheck,setPhaseCheck] = useState(false);
  let [externalLink, setExternalLink] = useState("");
  let [externalLinkCheck,setExternalLinkCheck] = useState(false);
  let [phychologicalContentTypeCheck,setPhychologicalContentTypeCheck]  = useState(false);
  let [nutritionContentTypeCheck, setNutritionContentTypeCheck] = useState(false);
  let [protocolContentTypeCheck, setProtocolContentTypeCheck] = useState(false);
  let [checkRequired, setCheckRequired] = useState(false);
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


  let [mediaInput, setMediaInput] = useState({
    type: "image",
    source: null,
    isError: false,
    errorMessage:"Image/Audio/Video is Required",
  })

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

  let [spinnerShow,setSpinnerShow]=useState(false)

  useEffect(() => {
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })
  },[title,description,mediaInput,phase,externalLink,phychologicalContentTypeCheck,nutritionContentTypeCheck.protocolContentTypeCheck])
    
  let handleUpload = (e) => {
    
    setMediaInput({...mediaInput,type:"image",isError:false,source:"https://changinghabits-dev-backend.s3.amazonaws.com/changinghabits/learning_content/loading-buffering_1625498388794.gif"})
    if (e.target.files[0]) {
      let fileType = e.target.files[0].type.split("/")[0];
      if (fileType != "image" && fileType != "video" && fileType != "audio") {
        setMediaInput({ ...mediaInput,type:null,source:null, isError: true, errorMessage: "Only image/video/audio file allowed" });
        return
      }

      if (e.target.files[0].size>11534336) {
        setMediaInput({ ...mediaInput,type:null, source:null,isError: true, errorMessage: "File size must be less than 10 mb" });
        return
      }
    
      let formData = new FormData();
      formData.append("folderName", "learning_content");
      formData.append("image", e.target.files[0])
      let req = {
        data:formData
      }
      setSpinnerShow(true)
      upload(req).then((response) => {
        setErrorResponse({ message: null, code: null, isFound: false })
        setMediaInput({ ...mediaInput, isError: false, type: fileType, source: response.image_url })
        setSpinnerShow(false)
      }).catch((error) => {
        setSpinnerShow(false)
        setMediaInput({ ...mediaInput, isError: true });
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    } else {
      setMediaInput({...mediaInput,type:null, source:null, isError: true, errorMessage: "Image/Audio/Video is Required" });
    }
  }


  
  useEffect(() => {
    if (params.id) {
      let req = {
        pathParams: {
            id: params.id,
        },
      }
      setSpinnerShow(true)
      getBlog(req).then((response) => {
        setErrorResponse({ message: null, code: null, isFound: false })
        setTitle(response.blogDetails.title)
        setDescription(response.blogDetails.description)
        setPhase(response.blogDetails.phase_id)
        setExternalLink(response.blogDetails.external_link)
        setPhychologicalContentTypeCheck(response.blogDetails.content_type == 1 ? true:false)
        setNutritionContentTypeCheck(response.blogDetails.content_type == 2 ? true : false)
        setProtocolContentTypeCheck(response.blogDetails.content_type == 3 ? true:false)
        setCheckRequired(false)
        if (response.blogDetails.image_url || response.blogDetails.video_url || response.blogDetails.audio_url) {
          setMediaInput({
            type: response.blogDetails.image_url?"image":response.blogDetails.video_url?"video":"audio",
            source: response.blogDetails.image_url || response.blogDetails.video_url || response.blogDetails.audio_url || null,
            isError: false,
          })
        }
        setSpinnerShow(false)
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }
  }, [])
  
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
    if (!phase || phase == 0) {
      setPhaseCheck(true)
      result=false
    }
    if (!externalLink || externalLink == "") {
      setExternalLinkCheck(true)
      result=false
    }
    if (mediaInput.source == "https://changinghabits-dev-backend.s3.amazonaws.com/changinghabits/learning_content/loading-buffering_1625498388794.gif" || !mediaInput.source) {
      setMediaInput({ ...mediaInput, isError: true });
      result=false
    }
    if (!phychologicalContentTypeCheck && !nutritionContentTypeCheck && !protocolContentTypeCheck) {
      setCheckRequired(true)
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
      phase_id: phase,
      external_link:externalLink,
      content_type: phychologicalContentTypeCheck ? 1 :nutritionContentTypeCheck? 2:3,
      image_url: mediaInput.type == "image"?mediaInput.source:null,
      video_url: mediaInput.type == "video" ? mediaInput.source : null,
      audio_url:mediaInput.type == "audio"?mediaInput.source:null,
    }
    // if (mediaInput.type == "image" || mediaInput.type == "video") {
    //   data[`${mediaInput.type}_url`]=mediaInput.source
    // }

    if (params.id) {
      let req = {
        pathParams: {
          id: params.id,
        },
        data
      }

 

      editBlog(req).then((response) => {
        setSpinnerShow(false)
        setErrorResponse({ message: null, code: null, isFound: false })
        setSuccessResponse({ message: "Updated Successfully" || null, code: 200 || null, isFound: true })
        history.push('/listKnowledgeBlog')
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    } else {
      let req = {
        data
      }
      addBlog(req).then((response) => {
        setSpinnerShow(false)
        setErrorResponse({ message: null, code: null, isFound: false })
        setSuccessResponse({ message:"Saved Successfully" || null, code: 200 || null, isFound: true })
        history.push('/listKnowledgeBlog')
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }

    
  }

    return (
    <CContainer fluid>
      <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                  <h2>
                    {history.location.pathname == "/addKnowledgeBlog" ? "Add Knowledge Blog" : "Edit Knowledge Blog"}
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
                  <CForm action="" method="post" onSubmit={handleSubmit}>
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
                   <CFormGroup style={{display:"flex", alignItems:"center"}}>
                    <CLabel style={{marginRight:"2rem",fontWeight:"600",fontSize:"1rem"}} htmlFor="media">Upload Image/Audio/Video:</CLabel>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    
                      <MediaView mediaInput={mediaInput} />
                      <div style={{display:"flex",flexDirection:"column"}}>
                    <CInputFile                     
                      style={{border:"none", marginLeft:"1rem"}}
                        accept="video/*,image/*,audio/*"
                        id="media"
                        name="media"
                        placeholder="Upload"
                          onChange={handleUpload}
                        disabled={spinnerShow}  
                      />
                      <label style={{ color: "red", marginLeft: "1rem",marginTop:"1rem" ,display: mediaInput.isError ? "block" : "none" }}>{ mediaInput.errorMessage}</label>
                    </div>
                      </div>
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
                    <CFormGroup  style={{width:"45%"}}>                    
                      <CLabel style={{marginRight:"0rem",fontWeight:"600",fontSize:"1rem"}} >Content Type:</CLabel>
                    <div style={{ marginLeft:"1.3rem",display: "flex", flexDirection: "row", alignItems:"baseline", justifyContent:"start",  }}>
                      
                      <div style={{marginRight:"1rem"}}><CLabel><CInputCheckbox
                        onChange={() => {
                          if (phychologicalContentTypeCheck) {
                            setPhychologicalContentTypeCheck(false)
                            setCheckRequired(true)
                          } else {
                            setPhychologicalContentTypeCheck(true)
                            setNutritionContentTypeCheck(false)
                            setProtocolContentTypeCheck(false)
                            setCheckRequired(false)
                          }
                        }}
                        checked={phychologicalContentTypeCheck}
                        type="checkbox"
                         id="content_type_phychological"
                      />Phychological</CLabel></div>
                      <div  style={{marginLeft:"1rem"}}><CLabel><CInputCheckbox
                        onChange={() => {
                           if (nutritionContentTypeCheck) {
                             setNutritionContentTypeCheck(false)
                             setCheckRequired(true)
                          }else {
                            setPhychologicalContentTypeCheck(false)
                             setNutritionContentTypeCheck(true)
                             setProtocolContentTypeCheck(false)
                            setCheckRequired(false) 
                          }
                        }}
                       checked={nutritionContentTypeCheck}
                        type="checkbox"
                        id="content_type_nutrition"
                      />Nutrition</CLabel></div>

                      <div  style={{marginLeft:"2rem"}}><CLabel><CInputCheckbox
                        onChange={() => {
                           if (protocolContentTypeCheck) {
                             setProtocolContentTypeCheck(false)
                             setCheckRequired(true)
                          }else {
                            setPhychologicalContentTypeCheck(false)
                             setNutritionContentTypeCheck(false)
                             setProtocolContentTypeCheck(true)
                            setCheckRequired(false) 
                          }
                        }}
                       checked={protocolContentTypeCheck}
                        type="checkbox"
                        id="content_type_nutrition"
                      />Protocol Info</CLabel></div>
                      
                      </div>
                   
                    <div style={{color:"red",display: checkRequired ? "" : "none"}}>Content type is required</div>
                  </CFormGroup>
                  </div>
                  <CFormGroup >                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="external_link">External Link:</CLabel>
                    <CInput
                      onChange={(e) => {
                        setExternalLinkCheck(false)
                        setExternalLink(e.target.value)
                      }}
                      value={externalLink}
                      type="text"
                      id="external_link"
                      name="external_link"
                      placeholder="Enter external link (eg: https://www.google.com)"
                      //required
                    />
                    <div style={{color:"red",marginLeft:"0.1rem", display:externalLinkCheck?"":"none"}}>External link is required</div>
                      </CFormGroup>
                  {/* <CFormGroup style={{display:"flex", alignItems:"center",}} >                    
                      <CLabel style={{marginRight:"2rem",fontWeight:"600",fontSize:"1rem"}} htmlFor="title">Content Type:</CLabel>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent:"start",  }}>
                      
                      <div style={{marginRight:"1rem"}}><CLabel><CInputCheckbox
                        onChange={() => {
                          if (phychologicalContentTypeCheck) {
                            setPhychologicalContentTypeCheck(false)
                            setCheckRequired(true)
                          } else {
                            setPhychologicalContentTypeCheck(true)
                            setNutritionContentTypeCheck(false)
                            setProtocolContentTypeCheck(false)
                            setCheckRequired(false)
                          }
                        }}
                        checked={phychologicalContentTypeCheck}
                        type="checkbox"
                         id="content_type_phychological"
                      />Phychological</CLabel></div>
                      <div  style={{marginLeft:"1rem"}}><CLabel><CInputCheckbox
                        onChange={() => {
                           if (nutritionContentTypeCheck) {
                             setNutritionContentTypeCheck(false)
                             setCheckRequired(true)
                          }else {
                            setPhychologicalContentTypeCheck(false)
                             setNutritionContentTypeCheck(true)
                             setProtocolContentTypeCheck(false)
                            setCheckRequired(false) 
                          }
                        }}
                       checked={nutritionContentTypeCheck}
                        type="checkbox"
                        id="content_type_nutrition"
                      />Nutrition</CLabel></div>

                      <div  style={{marginLeft:"2rem"}}><CLabel><CInputCheckbox
                        onChange={() => {
                           if (protocolContentTypeCheck) {
                             setProtocolContentTypeCheck(false)
                             setCheckRequired(true)
                          }else {
                            setPhychologicalContentTypeCheck(false)
                             setNutritionContentTypeCheck(false)
                             setProtocolContentTypeCheck(true)
                            setCheckRequired(false) 
                          }
                        }}
                       checked={protocolContentTypeCheck}
                        type="checkbox"
                        id="content_type_nutrition"
                      />Protocol Info</CLabel></div>
                      
                      </div>
                   
                    <div style={{color:"red",marginLeft:"2.5rem",display: checkRequired ? "" : "none"}}>Content type is required</div>
                  </CFormGroup> */}
                  
                  <CFormGroup style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                    <CButton
                      disabled={spinnerShow}
                      style={{ width: "5rem", marginRight:"3rem", backgroundColor: "#008080", color: "#fff" }}
                      type="submit"
                    >{spinnerShow?<CSpinner style={{ color: "#fff"}} size="sm" />:"Save"}</CButton>
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

export default AddEditKnowledgeBlog