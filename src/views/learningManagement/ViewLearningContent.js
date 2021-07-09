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
import {getLearningContent} from "../../data/learningContentManagement"

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
        setPhase(phases[response.learningContentDetails.phase_id])
        setPhaseDay(response.learningContentDetails.phase_day)
        setPhychologicalContentTypeCheck(response.learningContentDetails.content_type == 1 ? true:false)
        setNutritionContentTypeCheck(response.learningContentDetails.content_type == 2 ? true:false)
        if (response.learningContentDetails.image_url || response.learningContentDetails.video_url) {
          setMediaInput({
            type: response.learningContentDetails.image_url?"image":"video",
            source: response.learningContentDetails.image_url || response.learningContentDetails.video_url,
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
                  <div style={{display:"flex",justifyContent:"end"}}>  
                  <CButton
                        
                        style={{marginRight:"2rem", width: "5rem",backgroundColor:"#008080",color:"#fff" }}
                        onClick={()=>history.push(`/editLearningContent/${params.id}`)}
                    >
                        <strong>Edit</strong>
                  </CButton>
                  <CButton
                        
                        style={{ width: "5rem",backgroundColor:"#008080",color:"#fff" }}
                        onClick={()=>history.goBack()}
                    >
                        <strong>Back</strong>
                    </CButton>
                    </div>
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
                      <td> <CTextarea
                      value={description}
                      id="description"
                      name="description"
                        rows="5"
                        cols="80"
                      placeholder="Enter Description"
                      required
                  /></td>
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