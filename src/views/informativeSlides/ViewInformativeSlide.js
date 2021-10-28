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
import { getSlide,getSectionList } from "../../data/informativeSlides"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { CustomEditorViewer } from "src/utils/components/customEditor";

function ViewInformativeSlide(props) {
  let history = useHistory();
  let params = useParams();
  let [slideNumber, setSlideNumber] = useState("");
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [section,setSection]=useState(null);
  let [sectionList,setSectionList]=useState([]);
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

  useEffect(()=>{
        getSectionList().then((response) => {
            setSectionList(response.slideCategoryList)
        }).catch((error) => {
            setSpinnerShow(false);
            setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
        })
  },[])
  
  useEffect(() => {
    if (params.id) {
      let req = {
        pathParams: {
            id: params.id,
        },
      }
      setSpinnerShow(true);
      getSlide(req).then((response) => {
        setErrorResponse({ message: null, code: null, isFound: false })
        setTitle(response.slideDetails.title)
        setDescription(response.slideDetails.description)
        setSlideNumber(response.slideDetails.order)
        setSection(sectionList.find(item=>item.id==response.slideDetails.section_id))
        
        if (response.slideDetails.image_url) {
          setMediaInput({
            type: response.slideDetails.image_url?"image":response.slideDetails.video_url?"video":response.slideDetails.audio_url?"audio":"link",
            source: response.slideDetails.image_url || response.slideDetails.video_url || response.slideDetails.audio_url || response.slideDetails.external_link || null,
            isError: false,
          })
        }
        setSpinnerShow(false)
      }).catch((error) => {
        setSpinnerShow(false);
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }
  },[sectionList])


  


    return (
    <CContainer fluid>
      <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                  <h2>
                    View Informative Slide
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
                          <td><CLabel style={{marginRight:"2rem",fontWeight:"600",fontSize:"1rem"}} htmlFor="title">Section</CLabel></td>
                          <td>:</td>
                      <td>{section && section.slide_category_name}</td>
                        </tr>
                        <tr>
                          <td><CLabel style={{marginRight:"2rem",fontWeight:"600",fontSize:"1rem"}} htmlFor="title">Slide No.</CLabel></td>
                          <td>:</td>
                      <td>{slideNumber}</td>
                        </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="title">Title</CLabel></td>
                          <td>:</td>
                      <td>{title}</td>
                      </tr>
                      <tr>
                          <td><CLabel style={{marginRight:"2rem",fontWeight:"600",fontSize:"1rem"}} htmlFor="media">Image</CLabel></td>
                          <td>:</td>
                      <td><MediaView mediaInput={mediaInput} /></td>
                      </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="description">Description</CLabel></td>
                          <td>:</td>
                      <td> 
                        
                        <CustomEditorViewer
                          description={description}
                        />
                  </td>
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

export default ViewInformativeSlide;