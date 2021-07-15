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
import {getPhaseDays,getLearningContent,addLearningContent,editLearningContent} from "../../data/learningContentManagement"
import { faLaptopHouse } from "@fortawesome/free-solid-svg-icons";
import { checkLeapYear } from "../../utils/helper";

function AddEditLearningContent(props) {
  let history = useHistory();
  let params = useParams();

  let [title, setTitle] = useState("");
  let [titleCheck,setTitleCheck ] = useState(false);
  let [description, setDescription] = useState("");
  let [descriptionCheck,setDescriptionCheck] = useState(false);
  let [phase, setPhase] = useState(0);
  let [phaseCheck,setPhaseCheck] = useState(false);
  let [phaseDay, setPhaseDay] = useState(0);
  let [phaseDayCheck,setPhaseDayCheck] = useState(false);
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
    errorMessage:"Image/Video is Required",
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
      setMediaInput({...mediaInput,type:null, source:null, isError: true, errorMessage: "Image/Video is Required" });
    }
  }

  useEffect(() => {
    if (phase > 0) {
      let req = {
        pathParams: {
          id: phase,
        },
      }
      setSpinnerShow(true)
      getPhaseDays(req).then((response) => {
        setSpinnerShow(false)
        let newPhaseDaysList = []
        let limit = response.phaseDays ? response.phaseDays : checkLeapYear(new Date().getFullYear()) ? 366 : 365;
        for (let i = 1; i <= limit;  i++) {
          newPhaseDaysList.push(i)
        }
        setPhaseDaysList([...newPhaseDaysList]);
        setErrorResponse({ message: null, code: null, isFound: false })
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }
    else {
      setPhaseDaysList([]);
    }
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
            source: response.learningContentDetails.image_url ?response.learningContentDetails.image_url: response.learningContentDetails.video_url,
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
    if (!phaseDay || phaseDay == 0) {
      setPhaseDayCheck(true)
      result=false
    }
    if (mediaInput.source == "https://changinghabits-dev-backend.s3.amazonaws.com/changinghabits/learning_content/loading-buffering_1625498388794.gif" || !mediaInput.source) {
      setMediaInput({ ...mediaInput, isError: true });
      result=false
    }
    if (!phychologicalContentTypeCheck && !nutritionContentTypeCheck) {
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
      phase_day: phaseDay,
      content_type: phychologicalContentTypeCheck ? 1 : 2,
      image_url: mediaInput.type == "image"?mediaInput.source:null,
      video_url:mediaInput.type == "video"?mediaInput.source:null
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

      console.log("data",data)

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
    setTitleCheck(false)
    setDescriptionCheck(false)
    setPhaseCheck(false)
    setPhaseDayCheck(false)
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
                  
                  <CFormGroup style={{width:"45%"}}>
                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="phase_day">Phase Day:</CLabel>
                    <CSelect
                        onChange={(e) => {
                          setPhaseDayCheck(false)
                          setPhaseDay(e.target.value)
                        }}
                      value={phaseDay}
                      id="phase_day"
                        name="phase_day"
                        custom
                      //required
                    > <option value="0" defaultValue>Select Day</option>
                      {phaseDaysList.map((day) => {
                        return <option key={day} value={day}> {day}</option>
                    })}
                      </CSelect>
                      <div style={{color:"red",marginLeft:"0.1rem", display:phaseDayCheck?"":"none"}}>Phase Day is required</div>
                    </CFormGroup>
                    </div>
                  <CFormGroup style={{display:"flex", alignItems:"center",}} >                    
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
                   
                    <div style={{color:"red",marginLeft:"2.5rem",display: checkRequired ? "" : "none"}}>Content type is required</div>
                  </CFormGroup>
                  
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

export default AddEditLearningContent