import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import Select from 'react-select';
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
  CInputGroup,
  CInputGroupAppend,
  CBadge,
  CTooltip
} from "@coreui/react"
import { FaPlus } from 'react-icons/fa';
import { upload } from "../../data/upload";
import MediaView from "src/utils/components/mediaView";
import {getSlide,addSlide,editSlide, getSectionList,addSection} from "../../data/informativeSlides"
import {CustomEditor} from "src/utils/components/customEditor";

function AddEditInformativeSlide(props) {
  let history = useHistory();
  let params = useParams();
  let customEditorRef=useRef()

  let [title, setTitle] = useState("");
  let [titleCheck,setTitleCheck ] = useState(false);
  let [description, setDescription] = useState("");
  let [descriptionCheck,setDescriptionCheck] = useState(false);
  let [section, setSection] = useState(null);
  let [sectionCheck,setSectionCheck] = useState(false);
  let [sectionList,setSectionList]=useState([]);
  let [showAddSectionInput,setShowAddSectionInput]=useState(false);
  let [disableAddSectionInput,setDisableAddSectionInput]=useState(false);
  let [newSection,setNewSection]=useState("");
  let [newSectionCheck,setNewSectionCheck]=useState(false);
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
    errorMessage:"",
  })


  let [spinnerShow,setSpinnerShow]=useState(false)

  useEffect(() => {
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })
  },[title,description,mediaInput,section])
    
  let handleUpload = (e) => {
    setMediaInput({...mediaInput,type:"image",isError:false,source:"https://changinghabits-dev-backend.s3.amazonaws.com/changinghabits/learning_content/loading-buffering_1625498388794.gif"})
    if (e.target.files[0]) {
      let fileType = e.target.files[0].type.split("/")[0];
      if (fileType != "image") {
        setMediaInput({ ...mediaInput,type:null,source:null, isError: true, errorMessage: "Only image file allowed" });
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
      setMediaInput({...mediaInput, isError: false });
    }
  }

  let updateSectionList=(data=null)=>{
    setSpinnerShow(true)
    getSectionList().then((response)=>{
      console.log("response",response)
      setSectionList(response.slideCategoryList.map((section)=>{
        return {
          ...section,
          value:section.id,
          label:section.slide_category_name
        }
      }))

      if(data){
        console.log("data",data)
        let addedSection=response.slideCategoryList.find(item=>item.slide_category_name==data.slide_category_name);
        if(addedSection){
          setSection({
            ...addedSection,
            value:addedSection.id,
            label:addedSection.slide_category_name
          })
        }
        setSectionCheck(false)
        setNewSection("")
      }
      setSpinnerShow(false)
    }).catch((error) => {
      setSpinnerShow(false)
      setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
    })
  }

  useEffect(()=>{
    updateSectionList();
  },[])
  
  useEffect(() => {
    if (params.id) {
      let req = {
        pathParams: {
            id: params.id,
        },
      }
      setSpinnerShow(true)
      getSlide(req).then((response) => {
        console.log("slide",sectionList)
        console.log("slide",response)
        setErrorResponse({ message: null, code: null, isFound: false })
        setTitle(response.slideDetails.title)
        setDescription(response.slideDetails.description)
        customEditorRef.current.updateEditorValue()    
        if(!section){
          setSection(sectionList.find(item=>item.id==response.slideDetails.section_id))
        }
        setSectionCheck(false)
        if (response.slideDetails.image_url) {
          setMediaInput({
            type: "image",
            source: response.slideDetails.image_url || null,
            isError: false,
          })
        }
        setSpinnerShow(false)
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }
  }, [sectionList])

  let handleAddNewSection=(e)=>{
    e.preventDefault();
    if (!newSection || newSection.trim() == "") {
      setNewSectionCheck(true)
      return
    }
    setSpinnerShow(true)
    let data={
      slide_category_name:newSection,
    }
    let req = {
      data
    }

    addSection(req).then((response) => {
      setSpinnerShow(false)
      setErrorResponse({ message: null, code: null, isFound: false })
      updateSectionList(data);
    }).catch((error) => {
      setSpinnerShow(false)
      setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
    })
  }
  
  let validateField = () => {
    let result = true;

    if (!section) {
      setSectionCheck(true)
      result=false
    }

    if (!title || title.trim() == "") {
      setTitleCheck(true)
      result=false
    }

    if(mediaInput.isError){
      result=false;
    }
    
    if(!customEditorRef.current.validateEditorValue()){
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
      section_id: section.id,
      image_url: mediaInput.type == "image"?mediaInput.source:null,
    }

    if (params.id) {
      let req = {
        pathParams: {
          id: params.id,
        },
        data
      }

 

      editSlide(req).then((response) => {
        setSpinnerShow(false)
        setErrorResponse({ message: null, code: null, isFound: false })
        setSuccessResponse({ message: "Updated Successfully" || null, code: 200 || null, isFound: true })
        history.push('/listInformativeSlides')
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    } else {
      let req = {
        data
      }
      addSlide(req).then((response) => {
        setSpinnerShow(false)
        setErrorResponse({ message: null, code: null, isFound: false })
        setSuccessResponse({ message:"Saved Successfully" || null, code: 200 || null, isFound: true })
        history.push('/listInformativeSlides')
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
                    {history.location.pathname == "/addInformativeSlide" ? "Add Informative Slide" : "Edit Informative Slide"}
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
                  <CForm action="#" method="post" onSubmit={handleSubmit}  autoComplete="off">
                  <CFormGroup>                    
                      <CLabel style={{marginRight:"0rem",fontWeight:"600",fontSize:"1rem"}} >Section:</CLabel>
                  
                      <div>
                        <div>
                      <Select 
                        options={sectionList}
                        placeholder="Select Section"
                        onChange={(e) => {
                          console.log(e)
                          setSectionCheck(false)
                          setSection(e)
                        }}
                        value={section}
                        isDisabled={disableAddSectionInput}
                        />
                        <div style={{color:"red",display: sectionCheck ? "" : "none"}}>Section is required</div>
                        </div>
                        <div style={{marginTop:"0.5rem",display:showAddSectionInput?"none":""}}>
                        <CTooltip content={"Add new section"} placement={"top-start"}>
                          <CBadge
                            style={{ cursor: "pointer"}}
                            color="secondary"
                            onClick={()=>{
                              setShowAddSectionInput(true)
                              setDisableAddSectionInput(true)
                            }}
                            
                          ><FaPlus /></CBadge>
                        </CTooltip>
                        </div>
                        <div style={{marginTop:"1rem", display:showAddSectionInput?"":"none"}}>
                        <CInputGroup >
                         <CInput
                          onChange={(e) => {
                            setNewSectionCheck(false)
                            setNewSection(e.target.value)
                          }}
                          value={newSection}
                          type="text"
                          id="new_section_name"
                          name="new_section_name"
                          placeholder="Enter new section name"
                              
                          />                          
                          <CInputGroupAppend >                              
                                <CButton 
                                  style={{width:"4rem",backgroundColor: "#008080", color: "#fff", marginLeft:"0.5rem", borderRadius:"5px"}}
                                  onClick={handleAddNewSection}
                                  disabled={spinnerShow}
                                >{spinnerShow?<CSpinner style={{ color: "#fff"}} size="sm" />:"Add"}</CButton>
                                <CButton 
                                  style={{ width:"4rem",backgroundColor: "grey", color: "#fff",marginLeft:"0.5rem",borderRadius:"5px"}}
                                  onClick={()=>{
                                    setNewSection("")
                                    setShowAddSectionInput(false)
                                    setDisableAddSectionInput(false)
                                  }}
                                  disabled={spinnerShow}
                                >Done</CButton>
                          </CInputGroupAppend>
                        </CInputGroup>
                        <div style={{color:"red",display: newSectionCheck ? "" : "none"}}>New section name is required</div>
                        </div>
                        </div>
                  </CFormGroup>
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
                    <CLabel style={{marginRight:"2rem",fontWeight:"600",fontSize:"1rem"}} htmlFor="media">Upload Image:</CLabel>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    
                      <MediaView mediaInput={mediaInput} showFlag={false} />
                      <div style={{display:"flex",flexDirection:"column"}}>
                    <CInputFile                     
                      style={{border:"none", marginLeft:"1rem"}}
                        accept="image/*"
                        id="media"
                        name="media"
                        placeholder="Upload"
                          onChange={handleUpload}
                        disabled={spinnerShow}  
                      />    
                      <div style={{ color: "red", marginLeft: "1rem",marginTop:"1rem" ,display: mediaInput.isError ? "block" : "none" }}>
                        { mediaInput.errorMessage}
                          <CButton 
                            style={{width:"5rem",marginLeft:"3rem",}}
                            color="secondary"
                            onClick={(e)=>{
                              setMediaInput({
                                ...mediaInput,
                                isError: false,
                              })
                            }} >Reset</CButton>
                        </div>
                    </div>
                      </div>
                  </CFormGroup>
                  <CFormGroup >                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem",}} htmlFor="description">Description:</CLabel>      
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
      
                  
                  
                  <CFormGroup style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                    <CButton
                      disabled={spinnerShow}
                      style={{ width: "5rem", marginRight:"3rem", backgroundColor: "#008080", color: "#fff" }}
                      type="submit"
                    >{spinnerShow?<CSpinner style={{ color: "#fff"}} size="sm" />:"Publish"}</CButton>
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

export default AddEditInformativeSlide;