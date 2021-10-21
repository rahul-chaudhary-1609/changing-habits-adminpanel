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
  CSpinner
   
} from "@coreui/react"
import CIcon from "@coreui/icons-react";
import MediaView from "src/utils/components/mediaView";
import { getLearningContent } from "../../data/learningContentManagement"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { CustomEditorViewer } from "src/utils/components/customEditor";

function ViewLearningContent(props) {
  let history = useHistory();
  let params = useParams();

let [title,setTitle ] = useState("");
  let [description,setDescription] = useState("");
  let [phase,setPhase] = useState("");
  let [ phaseDay,setPhaseDay ] = useState(1);
  let [phychologicalContentTypeCheck,setPhychologicalContentTypeCheck]  = useState(false);
  let [nutritionContentTypeCheck, setNutritionContentTypeCheck] = useState(false);
 let [errorResponse, setErrorResponse] = useState({
        message: null,
        code: null,
        isFound: false,
 });
  let [spinnerShow,setSpinnerShow]=useState(false)


  let [mediaInput, setMediaInput] = useState({
    type: "image",
    source: null,
    isError: false,
    errorMessage:"Required",
  })

  let phases = [
    "Kickstart",
   "Phase 1",
   "Phase 2",
    "Phase 3",
   "Phase 4",
    "Phase 4 EVA"
  ]
  
  useEffect(() => {
    if (params.id) {
      let req = {
        pathParams: {
            id: params.id,
        },
      }
      setSpinnerShow(true);
      getLearningContent(req).then((response) => {
        setSpinnerShow(false)
        setErrorResponse({ message: null, code: null, isFound: false })
        setTitle(response.learningContentDetails.title)
        setDescription(response.learningContentDetails.description)
        setPhase(phases[response.learningContentDetails.phase_id-1])
        setPhaseDay(response.learningContentDetails.phase_day)
        setPhychologicalContentTypeCheck(response.learningContentDetails.content_type == 1 ? true:false)
        setNutritionContentTypeCheck(response.learningContentDetails.content_type == 2 ? true:false)
        if (response.learningContentDetails.image_url || response.learningContentDetails.video_url) {
          setMediaInput({
             type: response.learningContentDetails.image_url && response.learningContentDetails.image_url!="https://null"?"image":"video",
            source: response.learningContentDetails.image_url && response.learningContentDetails.image_url!="https://null"?response.learningContentDetails.image_url: response.learningContentDetails.video_url,
            isError: false,
          })
        }
      }).catch((error) => {
        setSpinnerShow(false);
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }
  },[])


  


    return (
    <CContainer fluid>
      <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                  <h2>
                    View Learning Content
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
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="title">Title</CLabel></td>
                          <td>:</td>
                      <td>{title}</td>
                      </tr>
                      <tr>
                          <td><CLabel style={{marginRight:"2rem",fontWeight:"600",fontSize:"1rem"}} htmlFor="media">Image/Video</CLabel></td>
                          <td>:</td>
                      <td><MediaView mediaInput={mediaInput} /></td>
                      </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="description">Description</CLabel></td>
                          <td>:</td>
                      <td>
                      {/* <div dangerouslySetInnerHTML={{__html: description}} />  */}
                        
                        <CustomEditorViewer
                          description={description}
                        />
                  
                  
                  </td>
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
                      <tr>
                          <td><CLabel style={{marginRight:"2rem",fontWeight:"600",fontSize:"1rem"}} htmlFor="title">Content Type</CLabel></td>
                          <td>:</td>
                      <td>{phychologicalContentTypeCheck ? "Phychological" : "Nutrition"}</td>
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

export default ViewLearningContent