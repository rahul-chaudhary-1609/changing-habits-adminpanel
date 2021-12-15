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
import { getBlog, addBlog, editBlog, listBlogContentType, addBlogContentType } from "../../data/knowledgeCenterManagement"
import { phaseList } from "../../utils/helper";
import { CustomEditor } from "src/utils/components/customEditor";

function AddEditKnowledgeBlog(props) {
  let history = useHistory();
  let params = useParams();
  let customEditorRef = useRef()

  let [title, setTitle] = useState("");
  let [titleCheck, setTitleCheck] = useState(false);
  let [description, setDescription] = useState("");
  let [descriptionCheck, setDescriptionCheck] = useState(false);
  let [phase, setPhase] = useState([]);
  let [phaseCheck, setPhaseCheck] = useState(false);
  // let [externalLink, setExternalLink] = useState("");
  // let [externalLinkCheck, setExternalLinkCheck] = useState(false);
  let [contentTypeCheck, setContentTypeCheck] = useState(false);
  let [contentTypeList, setContentTypeList] = useState([]);
  let [contentType, setContentType] = useState([]);
  let [showAddContentInput, setShowAddContentInput] = useState(false);
  let [disableAddContentInput, setDisableAddContentInput] = useState(false);
  let [newContentType, setNewContentType] = useState("");
  let [newContentTypeCheck, setNewContentTypeCheck] = useState(false);
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
    errorMessage: "Image/Audio/Video/External link is required",
  })


  let [spinnerShow, setSpinnerShow] = useState(false)

  useEffect(() => {
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })
  }, [title, description, mediaInput, phase, contentType])

  let handleUpload = (e) => {
    // setExternalLinkCheck(false)
    setMediaInput({ ...mediaInput, type: "image", isError: false, source: "https://changinghabits-dev-backend.s3.amazonaws.com/changinghabits/learning_content/loading-buffering_1625498388794.gif" })
    if (e.target.files[0]) {
      let fileType = e.target.files[0].type.split("/")[0];
      if (fileType != "image" && fileType != "video" && fileType != "audio") {
        setMediaInput({ ...mediaInput, type: null, source: null, isError: true, errorMessage: "Only image/video/audio file allowed" });
        return
      }

      if (e.target.files[0].size > 11534336) {
        setMediaInput({ ...mediaInput, type: null, source: null, isError: true, errorMessage: "File size must be less than 10 mb" });
        return
      }

      let formData = new FormData();
      formData.append("folderName", "learning_content");
      formData.append("image", e.target.files[0])
      let req = {
        data: formData
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
      setMediaInput({ ...mediaInput, type: null, source: null, isError: true, errorMessage: "Image/Audio/Video/External link is required" });
    }
  }

  let updateContentList = (data = {}) => {
    setSpinnerShow(true)
    listBlogContentType().then((response) => {
      setContentTypeList(response.blogContentType.map((content) => {
        return {
          ...content,
          value: content.id,
          label: content.content_name
        }
      }))

      if (data.content_name) {
        let currentSelectedContentType = [...contentType];
        let newContent = response.blogContentType.find(content => content.content_name == data.content_name);
        if (newContent) {
          currentSelectedContentType.push(
            {
              ...newContent,
              value: newContent.id,
              label: newContent.content_name
            }
          )
        }
        setContentType(currentSelectedContentType)
        setContentTypeCheck(false)
        setNewContentType("")
      }
      setSpinnerShow(false)
    }).catch((error) => {
      setSpinnerShow(false)
      setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
    })
  }

  useEffect(() => {
    updateContentList();
  }, [])

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
        customEditorRef.current.updateEditorValue()
        let currentPhase = [];
        for (let label of response.blogDetails.phase_id) {
          let ph = phaseList.find(item => item.label == label)
          if (ph) currentPhase.push(ph);
        }
        setPhase(currentPhase)
        if (contentType.length == 0) {
          let currentContentType = [];
          for (let label of response.blogDetails.content_type) {
            let content = contentTypeList.find(item => item.label == label)
            if (content) currentContentType.push(content);
          }
          setContentType(currentContentType)
        }
        // else{
        //   setContentType([...contentType])
        // }
        // setExternalLink(response.blogDetails.external_link)
        setContentTypeCheck(false)
        if (response.blogDetails.image_url || response.blogDetails.video_url || response.blogDetails.audio_url) {
          setMediaInput({
            type: response.blogDetails.image_url ? "image" : response.blogDetails.video_url ? "video" : "audio",
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
  }, [contentTypeList])

  let handleAddNewContent = (e) => {
    e.preventDefault();
    if (!newContentType || newContentType.trim() == "") {
      setNewContentTypeCheck(true)
      return
    }
    setSpinnerShow(true)
    let data = {
      content_name: newContentType,
    }
    let req = {
      data
    }

    addBlogContentType(req).then((response) => {
      setSpinnerShow(false)
      setErrorResponse({ message: null, code: null, isFound: false })
      updateContentList(data);
    }).catch((error) => {
      setSpinnerShow(false)
      setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
    })
  }

  let validateField = () => {
    let result = true;
    if (!title || title.trim() == "") {
      setTitleCheck(true)
      result = false
    }
    // if (!description || description.trim() == "") {
    //   setDescriptionCheck(true)
    //   result=false
    // }
    if (!customEditorRef.current.validateEditorValue()) {
      result = false
    }
    if (phase.length == 0) {
      setPhaseCheck(true)
      result = false
    }
    if (contentType.length == 0) {
      setContentTypeCheck(true)
      result = false
    }
    // if (!externalLink || externalLink == "") {
    //   setExternalLinkCheck(true)
    //   result=false
    // }
    // if ((!externalLink || externalLink == "") && (mediaInput.source == "https://changinghabits-dev-backend.s3.amazonaws.com/changinghabits/learning_content/loading-buffering_1625498388794.gif" || !mediaInput.source)) {
    //   setMediaInput({ ...mediaInput, isError: true });
    //   setExternalLinkCheck(true)
    //   result = false
    // }

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
      phase_id: phase.map(ph => ph.id),
      // external_link: externalLink,
      content_type: contentType.map(content => content.id),
      image_url: mediaInput.type == "image" ? mediaInput.source : null,
      video_url: mediaInput.type == "video" ? mediaInput.source : null,
      audio_url: mediaInput.type == "audio" ? mediaInput.source : null,
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
        setSuccessResponse({ message: "Saved Successfully" || null, code: 200 || null, isFound: true })
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>
                  {history.location.pathname == "/addKnowledgeBlog" ? "Add Knowledge Blog" : "Edit Knowledge Blog"}
                  <CSpinner style={{ color: "#008080", marginLeft: "2rem", display: spinnerShow ? "" : "none" }} /></h2>
                {/* <CButton
                        
                        style={{ width: "5rem",backgroundColor:"#008080",color:"#fff" }}
                        onClick={()=>history.goBack()}
                    >
                        <strong>Back</strong>
                    </CButton> */}
              </div>

            </CCardHeader>
            <CCardBody>
              <div style={{ color: "red", fontSize: "1rem", display: errorResponse.isFound ? "flex" : "none", justifyContent: "center" }}>
                <div><h5>{errorResponse.message}</h5></div>
              </div>
              <div style={{ color: "green", fontSize: "1rem", display: successResponse.isFound ? "flex" : "none", justifyContent: "center" }}>
                <div><h5>{successResponse.message}</h5></div>
              </div>
              <CForm action="#" method="post" onSubmit={handleSubmit} autoComplete="off">
                <CFormGroup >
                  <CLabel style={{ fontWeight: "600", fontSize: "1rem" }} htmlFor="title">Title:</CLabel>
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
                  <div style={{ color: "red", marginLeft: "0.1rem", display: titleCheck ? "" : "none" }}>Title is required</div>
                </CFormGroup>
                <CFormGroup style={{ display: "flex", alignItems: "center" }}>
                  <CLabel style={{ marginRight: "2rem", fontWeight: "600", fontSize: "1rem" }} htmlFor="media">Upload Image/Audio/Video:</CLabel>
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                    <MediaView mediaInput={mediaInput} />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <CInputFile
                        style={{ border: "none", marginLeft: "1rem" }}
                        accept="video/*,image/*,audio/*"
                        id="media"
                        name="media"
                        placeholder="Upload"
                        onChange={handleUpload}
                        disabled={spinnerShow}
                      />
                      <label style={{ color: "red", marginLeft: "1rem", marginTop: "1rem", display: mediaInput.isError ? "block" : "none" }}>{mediaInput.errorMessage}</label>
                    </div>
                  </div>
                </CFormGroup>
                <CFormGroup >

                  <CLabel style={{ fontWeight: "600", fontSize: "1rem", }} htmlFor="description">Description:</CLabel>
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
                  <div style={{ color: "red", marginLeft: "0.1rem", display: descriptionCheck ? "" : "none" }}>Description is required</div>
                </CFormGroup>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <CFormGroup style={{ width: "45%" }}>

                    <CLabel style={{ fontWeight: "600", fontSize: "1rem" }} htmlFor="phase">Phase:</CLabel>

                    <Select
                      options={phaseList}
                      isMulti
                      placeholder="Select Phase"
                      onChange={(e) => {
                        console.log(e)
                        setPhaseCheck(false)
                        setPhase(e)
                      }}
                      value={phase} />
                    <div style={{ color: "red", marginLeft: "0.1rem", display: phaseCheck ? "" : "none" }}>Phase is required</div>
                  </CFormGroup>
                  <CFormGroup style={{ width: "45%" }}>
                    <CLabel style={{ marginRight: "0rem", fontWeight: "600", fontSize: "1rem" }} >Content Type:</CLabel>

                    <div>
                      <div>
                        <Select
                          options={contentTypeList}
                          isMulti
                          placeholder="Select Content Type"
                          onChange={(e) => {
                            console.log(e)
                            setContentTypeCheck(false)
                            setContentType(e)
                          }}
                          value={contentType}
                          isDisabled={disableAddContentInput}
                        />
                        <div style={{ color: "red", display: contentTypeCheck ? "" : "none" }}>Content type is required</div>
                      </div>
                      <div style={{ marginTop: "0.5rem", display: showAddContentInput ? "none" : "" }}>
                        <CTooltip content={"Add new content type"} placement={"top-start"}>
                          <CBadge
                            style={{ cursor: "pointer" }}
                            color="secondary"
                            onClick={() => {
                              setShowAddContentInput(true)
                              setDisableAddContentInput(true)
                            }}

                          ><FaPlus /></CBadge>
                        </CTooltip>
                      </div>
                      <div style={{ marginTop: "1rem", display: showAddContentInput ? "" : "none" }}>
                        <CInputGroup >
                          <CInput
                            onChange={(e) => {
                              setNewContentTypeCheck(false)
                              setNewContentType(e.target.value)
                            }}
                            value={newContentType}
                            type="text"
                            id="new_content_type_name"
                            name="new_content_type_name"
                            placeholder="Enter new content type name"

                          />
                          <CInputGroupAppend >
                            <CButton
                              style={{ width: "4rem", backgroundColor: "#008080", color: "#fff", marginLeft: "0.5rem", borderRadius: "5px" }}
                              onClick={handleAddNewContent}
                              disabled={spinnerShow}
                            >{spinnerShow ? <CSpinner style={{ color: "#fff" }} size="sm" /> : "Add"}</CButton>
                            <CButton
                              style={{ width: "4rem", backgroundColor: "grey", color: "#fff", marginLeft: "0.5rem", borderRadius: "5px" }}
                              onClick={() => {
                                setNewContentType("")
                                setShowAddContentInput(false)
                                setDisableAddContentInput(false)
                              }}
                              disabled={spinnerShow}
                            >Done</CButton>
                          </CInputGroupAppend>
                        </CInputGroup>
                        <div style={{ color: "red", display: newContentTypeCheck ? "" : "none" }}>New content type name is required</div>
                      </div>
                    </div>
                  </CFormGroup>
                </div>
                <CFormGroup style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CButton
                    disabled={spinnerShow}
                    style={{ width: "5rem", marginRight: "3rem", backgroundColor: "#008080", color: "#fff" }}
                    type="submit"
                  >{spinnerShow ? <CSpinner style={{ color: "#fff" }} size="sm" /> : "Publish"}</CButton>
                  <CButton style={{ width: "5rem", marginLeft: "3rem", }} color="danger" onClick={(e) => history.goBack()} >Cancel</CButton>
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