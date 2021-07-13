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
import { getBlog } from "../../data/knowledgeCenterManagement"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getFormatedDateTime } from "../../utils/helper";

function ViewKnowledgeBlog(props) {
  let history = useHistory();
  let params = useParams();
let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [phase, setPhase] = useState(0);
  let [externalLink, setExternalLink] = useState("");
  let [phychologicalContentTypeCheck,setPhychologicalContentTypeCheck]  = useState(false);
  let [nutritionContentTypeCheck, setNutritionContentTypeCheck] = useState(false);
  let [protocolContentTypeCheck, setProtocolContentTypeCheck] = useState(false);
  let [postedDate, setPostedDate] = useState("");
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
      getBlog(req).then((response) => {
        setErrorResponse({ message: null, code: null, isFound: false })
        setTitle(response.blogDetails.title)
        setDescription(response.blogDetails.description)
        setPhase(phases[response.blogDetails.phase_id-1])
        setExternalLink(response.blogDetails.external_link)
        setPostedDate(response.blogDetails.createdAt)
        setPhychologicalContentTypeCheck(response.blogDetails.content_type == 1 ? true:false)
        setNutritionContentTypeCheck(response.blogDetails.content_type == 2 ? true : false)
        setProtocolContentTypeCheck(response.blogDetails.content_type == 3 ? true:false)
        
        if (response.blogDetails.image_url || response.blogDetails.video_url || response.blogDetails.audio_url) {
          setMediaInput({
            type: response.blogDetails.image_url?"image":response.blogDetails.video_url?"video":"audio",
            source: response.blogDetails.image_url || response.blogDetails.video_url || response.blogDetails.audio_url || null,
            isError: false,
          })
        }
        setSpinnerShow(false)
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
                    View Knowledge Blog
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
                          <td><CLabel style={{marginRight:"2rem",fontWeight:"600",fontSize:"1rem"}} htmlFor="title">Content Type</CLabel></td>
                          <td>:</td>
                      <td>{phychologicalContentTypeCheck ? "Phychological" : nutritionContentTypeCheck ?"Nutrition": "Protocol Info"}</td>
                        </tr>
                        <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="external_link">External Link</CLabel></td>
                          <td>:</td>
                      <td><a href={externalLink} target="_blank">{externalLink}</a></td>
                        </tr>
                        <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="posted_date">Posted Date</CLabel></td>
                          <td>:</td>
                      <td>{getFormatedDateTime(postedDate)}</td>
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

export default ViewKnowledgeBlog