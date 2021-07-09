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
  CSpinner
   
} from "@coreui/react"
import CIcon from "@coreui/icons-react";
import { upload } from "../../data/upload";
import MediaView from "src/utils/components/mediaView";
import {getPhaseDays,getLearningContent,addLearningContent,editLearningContent} from "../../data/learningContentManagement"

function AddEditLearningContent(props) {
  let history = useHistory();
  let params = useParams();

let [title,setTitle ] = useState("");
  let [description,setDescription] = useState("");
  let [phase,setPhase] = useState(1);
  let [ phaseDay,setPhaseDay ] = useState(1);
  let [phychologicalContentTypeCheck,setPhychologicalContentTypeCheck]  = useState(false);
  let [nutritionContentTypeCheck, setNutritionContentTypeCheck] = useState(false);
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
    errorMessage:"Required",
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

  let [phaseDaysList, setPhaseDaysList] = useState([]);
  let [spinnerShow,setSpinnerShow]=useState(false)

  useEffect(() => {
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })
  },[title,description,mediaInput,phase,phaseDay,phaseDaysList,phychologicalContentTypeCheck,nutritionContentTypeCheck])
    
  let handleUpload = (e) => {
    setMediaInput({...mediaInput,type:"image",isError:false,source:"https://changinghabits-dev-backend.s3.amazonaws.com/changinghabits/learning_content/loading-buffering_1625498388794.gif"})
    if (e.target.files[0]) {
      let fileType = e.target.files[0].type.split("/")[0];
      if (fileType != "image" && fileType != "video") {
        setMediaInput({ ...mediaInput,type:null,source:null, isError: true, errorMessage: "Only image/video file allowed" });
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
      setMediaInput({...mediaInput,type:null, source:null, isError: true, errorMessage: "Required" });
    }
  }

  useEffect(() => {
    let req = {
        pathParams: {
            id: phase,
        },
    }
    setSpinnerShow(true)
    getPhaseDays(req).then((response) => {
      setSpinnerShow(false)
      let newPhaseDaysList = []
      for (let i = 1; i <= response.phaseDays; i++){
        newPhaseDaysList.push(i)
      }
      setPhaseDaysList([...newPhaseDaysList]);
      setErrorResponse({ message: null, code: null, isFound: false })
    }).catch((error) => {
      setSpinnerShow(false)
      setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
    })
  }, [phase])
  
  useEffect(() => {
    if (params.id) {
      let req = {
        pathParams: {
            id: params.id,
        },
      }
      setSpinnerShow(true)
      getLearningContent(req).then((response) => {
        setErrorResponse({ message: null, code: null, isFound: false })
        setTitle(response.learningContentDetails.title)
        setDescription(response.learningContentDetails.description)
        setPhase(response.learningContentDetails.phase_id)
        setPhaseDay(response.learningContentDetails.phase_day)
        setPhychologicalContentTypeCheck(response.learningContentDetails.content_type == 1 ? true:false)
        setNutritionContentTypeCheck(response.learningContentDetails.content_type == 2 ? true:false)
        setCheckRequired(false)
        if (response.learningContentDetails.image_url || response.learningContentDetails.video_url) {
          setMediaInput({
            type: response.learningContentDetails.image_url?"image":"video",
            source: response.learningContentDetails.image_url || response.learningContentDetails.video_url,
            isError: false,
          })
        }
        setSpinnerShow(false)
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }
  },[])


  let handleSubmit = (e) => {
    e.preventDefault();
    setSpinnerShow(true)
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })
    if (mediaInput.source == "https://changinghabits-dev-backend.s3.amazonaws.com/changinghabits/learning_content/loading-buffering_1625498388794.gif" || !mediaInput.source) {
      setMediaInput({ ...mediaInput, isError: true });
      return
    }
    if (!phychologicalContentTypeCheck && !nutritionContentTypeCheck) {
      setCheckRequired(true)
      return
    }
    
    let data = {
      title: title,
      description: description,
      phase_id: phase,
      phase_day: phaseDay,
      content_type: phychologicalContentTypeCheck ? 1 : 2,
    }
    if (mediaInput.type == "image" || mediaInput.type == "video") {
      data[`${mediaInput.type}_url`]=mediaInput.source
    }

    if (params.id) {
      let req = {
        pathParams: {
          id: params.id,
        },
        data
      }

      editLearningContent(req).then((response) => {
        setSpinnerShow(false)
        setErrorResponse({ message: null, code: null, isFound: false })
        setSuccessResponse({ message: "Updated Successfully" || null, code: 200 || null, isFound: true })
        history.push('/listLearning/content')
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    } else {
      let req = {
        data
      }
      addLearningContent(req).then((response) => {
        setSpinnerShow(false)
        setErrorResponse({ message: null, code: null, isFound: false })
        setSuccessResponse({ message:"Saved Successfully" || null, code: 200 || null, isFound: true })
        history.push('/listLearning/content')
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }

    
  }

  let handleReset = (e) => {
    e.preventDefault();
    setTitle("")
    setDescription("")
    setPhase(1)
    setPhaseDay(1)
    setPhaseDaysList([])
    setPhychologicalContentTypeCheck(false)
    setNutritionContentTypeCheck(false)
    setCheckRequired(false)
    setMediaInput({
      type: "image",
      source: null,
      isError:false,
    })
    setSpinnerShow(false)
  }

    return (
    <CContainer fluid>
      <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                  <h2>
                    {history.location.pathname == "/addLearningContent" ? "Add Learning Content" : "Edit Learning Content"}
                  <CSpinner style={{color:"#008080", marginLeft:"2rem", display:spinnerShow?"":"none"}} /></h2>
                    <CButton
                        
                        style={{ width: "5rem",backgroundColor:"#008080",color:"#fff" }}
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
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="title">Title:</CLabel>
                    <CInput
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Enter Title"
                      required
                    />
                    
                      </CFormGroup>
                   <CFormGroup style={{display:"flex", alignItems:"center"}}>
                    <CLabel style={{marginRight:"2rem",fontWeight:"600",fontSize:"1rem"}} htmlFor="media">Upload Image/Video:</CLabel>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    
                      <MediaView mediaInput={mediaInput} />
                      <div style={{display:"flex",flexDirection:"column"}}>
                    <CInputFile                     
                      style={{border:"none", marginLeft:"1rem"}}
                        accept="video/*,image/*"
                        id="media"
                        name="media"
                        placeholder="Upload"
                        onChange={handleUpload}                        
                      />
                      <label style={{ color: "red", marginLeft: "1rem",marginTop:"1rem" ,display: mediaInput.isError ? "block" : "none" }}>{ mediaInput.errorMessage}</label>
                    </div>
                      </div>
                  </CFormGroup>
                  <CFormGroup >
                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="description">Description:</CLabel>
                    <CTextarea
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      id="description"
                      name="description"
                          rows="5"
                          type="text"
                          id="title"
                          name="title"
                      placeholder="Enter Description"
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
                        custom
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
                        custom
                      required
                    > <option value="" defaultValue disabled>Select Day</option>
                      {phaseDaysList.map((day) => {
                        return <option key={day} value={day}> {day}</option>
                    })}
                    </CSelect>  
                    </CFormGroup>
                    </div>
                  <CFormGroup style={{display:"flex", alignItems:"center",border:checkRequired?"3.5px solid rgba(0,0,255,0.3)":"none",}} >                    
                      <CLabel style={{marginRight:"2rem",fontWeight:"600",fontSize:"1rem"}} htmlFor="title">Content Type:</CLabel>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent:"space-around",  }}>
                      
                      <div style={{marginRight:"1rem"}}><CLabel><CInputCheckbox
                        onChange={() => {
                          if (phychologicalContentTypeCheck) {
                            setPhychologicalContentTypeCheck(false)
                            setCheckRequired(true)
                          } else {
                            setPhychologicalContentTypeCheck(true)
                            setNutritionContentTypeCheck(false)
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
                            setCheckRequired(false) 
                          }
                        }}
                       checked={nutritionContentTypeCheck}
                        type="checkbox"
                        id="content_type_nutrition"
                      />Nutrition</CLabel></div>
                      
                      </div>
                    <label style={{color:"red",marginLeft:"2.5rem",display:checkRequired?"block":"none"}}>Required</label>
                  </CFormGroup>
                  
                  <CFormGroup style={{display:"flex", alignItems:"center", justifyContent:"space-around"}}>
                    <CButton
                      disabled={spinnerShow}
                      style={{ width: "10rem", backgroundColor: "#008080", color: "#fff" }}
                      type="submit"
                    >Save <CSpinner style={{ color: "#fff", marginLeft: "1rem", display:spinnerShow?"":"none" }} size="sm" /></CButton>
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

export default AddEditLearningContent