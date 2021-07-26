import React, { useState, useEffect, useRef } from "react";
import { useHistory,useParams } from "react-router-dom";
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
  CSelect,
  CSpinner,
  CInputGroup,
  CInputGroupAppend,
  CBadge
} from "@coreui/react"
import { listPhases } from "../../data/foodLogManagement"
import {getReason,addReason,editReason} from "../../data/weightGainReasonManagement"
import { FaPlus,FaMinus } from 'react-icons/fa';

function AddEditWeightGainReason() {
  let history = useHistory();
  let params = useParams();

  let [phase, setPhase] = useState(0);
  let [phaseCheck, setPhaseCheck] = useState(false);
  let [colorCode, setColorCode] = useState(0);
  let [colorCodeCheck, setColorCodeCheck] = useState(false);
  let [weightFrom, setWeightFrom] = useState(null);
  let [weightFromCheck, setWeightFromCheck] = useState({
        required: false,
        numeric:false
  });
  let [weightTo, setWeightTo] = useState(null);
  let [weightToCheck, setWeightToCheck] = useState({
        required: false,
        numeric:false
  });
  let [weightRangeCheck, setWeightRangeCheck] = useState(false);
  let [reasonInputFields, setReasonInputFields] = useState(
    [
      { reason_no: 1, reason_value: "",check:false },
    ]
  )
  let [reasonInputFieldsCheck, setReasonInputFieldsCheck] = useState(false);

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

  let [phaseList, setPhaseList] = useState([])

  let [colorCodeList, setColorCodeList] = useState([
    { id: 1, name: "Orange", },
    { id: 2, name: "Red" },
    { id: 3, name: "Green" },
    { id: 4, name: "Yellow" },
  ])
  let [spinnerShow,setSpinnerShow]=useState(false)
  //let spinnerShow = false;

  useEffect(() => {
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })
  },[phase,phaseList,colorCodeList,colorCode,weightFrom,weightTo,reasonInputFields])

  useEffect(() => {
    setSpinnerShow(true)
    listPhases().then((response) => {
      setPhaseList(response.phasesList)
      setSpinnerShow(false)
    }).catch((error) => {
          setSpinnerShow(false)
            setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
        })
    
    if (params.id) {
      let req = {
        pathParams: {
            id: params.id,
        },
      }
      setSpinnerShow(true)
      getReason(req).then((response) => {
        setErrorResponse({ message: null, code: null, isFound: false })
        setPhase(response.reasonDetails.phase_id)
        setColorCode(response.reasonDetails.color_code)
        setWeightFrom(response.reasonDetails.weight_from)
        setWeightTo(response.reasonDetails.weight_to)
        let currentReasonInputFields= response.reasonDetails.reason.map((reason,index) => {
          return { reason_no: ++index, reason_value: reason, check: false };
        })
        setReasonInputFields([...currentReasonInputFields]);
        setSpinnerShow(false)
        
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }
  }, [])

  let handleAddReasonField = () => {
    if (reasonInputFields.length >= 0) {
      setReasonInputFieldsCheck(false);
    }

    let currentReasonInputFields = [...reasonInputFields];
      currentReasonInputFields.push({ reason_no: currentReasonInputFields.length + 1, reason_value: "", check: false })
      currentReasonInputFields=currentReasonInputFields.map((currentReasonInputField, key) => {
        return {...currentReasonInputField,reason_no:++key}
        })
    setReasonInputFields(currentReasonInputFields)
  }

  let handleRemoveReasonField = (index) => {
    if (reasonInputFields.length < 2) {
      setReasonInputFieldsCheck(true);
    }
    let currentReasonInputFields = [...reasonInputFields];
      currentReasonInputFields.splice(index, 1);
      currentReasonInputFields=currentReasonInputFields.map((currentReasonInputField, key) => {
        return {...currentReasonInputField,reason_no:++key}
        })
    setReasonInputFields(currentReasonInputFields)
  }

  let handleChangeReasonFieldValue = (index, e) => {
    let currentReasonInputFields = [...reasonInputFields];
    currentReasonInputFields[index].reason_value = e.target.value;
    currentReasonInputFields[index].check = false;
    setReasonInputFields(currentReasonInputFields)
  }

  let validateField = () => {
    let result = true;
    if (!weightFrom) {
      setWeightFromCheck({...weightFromCheck,required:true})
      result=false
    }

    if (weightFrom && isNaN(weightFrom)) {
        setWeightFromCheck({...weightFromCheck,numeric:true})
        result=false
    }
    if (!weightTo) {
      setWeightToCheck({...weightToCheck,required:true})
      result=false
    }
      
    if (weightTo && isNaN(weightTo)) {
      setWeightToCheck({...weightToCheck,numeric:true})
      result=false
    }
      
    if (weightTo && !isNaN(weightTo) && weightFrom && !isNaN(weightFrom) && (parseFloat(weightTo) <= parseFloat(weightFrom))) {
      console.log(weightFrom,weightTo,weightTo <= weightFrom)
        setWeightRangeCheck(true)
        result=false
    }      

      
    if (!phase || phase == 0) {
      setPhaseCheck(true)
      result=false
    }

    if (!colorCode || colorCode == 0) {
      setColorCodeCheck(true)
      result=false
    }

    let currentReasonInputFields = [...reasonInputFields]
    for (let reasonInputField of currentReasonInputFields) {
      if (!reasonInputField.reason_value || reasonInputField.reason_value.trim() == "") {
        reasonInputField.check = true;
        result=false
      }
    }
    setReasonInputFields(currentReasonInputFields);
    
    if (reasonInputFields.length<1) {
      setReasonInputFieldsCheck(true)
      result=false
    }

    return result
  }



  let handleSubmit = (e) => {
    console.log(weightFrom, weightTo, weightTo <= weightFrom)
    console.log(weightRangeCheck)
    e.preventDefault();
    if (!validateField()) {
      return
    }
    setSpinnerShow(true)
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })

    
    let data = {
      phase_id: phase,
      color_code : colorCode,
      weight_from: weightFrom,
      weight_to: weightTo,
      reason: reasonInputFields.map(reasonInputField=>reasonInputField.reason_value)
    }
    
    if (params.id) {

      let req = {
        pathParams: {
          id: params.id,
        },
        data
      }

      editReason(req).then((response) => {
        setSpinnerShow(false)
        setErrorResponse({ message: null, code: null, isFound: false })
        setSuccessResponse({ message: "Updated Successfully" || null, code: 200 || null, isFound: true })
        history.push('/listWeightGainReason')
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    } else {

        
      let req = {
        data
      }
      addReason(req).then((response) => {
        setSpinnerShow(false)
        setErrorResponse({ message: null, code: null, isFound: false })
        setSuccessResponse({ message: "Saved Successfully" || null, code: 200 || null, isFound: true })
        history.push('/listWeightGainReason')
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
                  <h2>{history.location.pathname == "/addWeightGainReason" ? "Add Weight Gain Reason" : "Edit Weight Gain Reason"}
                  <CSpinner style={{color:"#008080", marginLeft:"2rem", display:spinnerShow?"":"none"}} /></h2>
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
                    
                    <CFormGroup>
                    <CLabel style={{ fontWeight: "600", fontSize: "1rem" }} htmlFor="reason">Reason:</CLabel>
                    {reasonInputFields.map((reasonInputField, index) => {
                      return (<>
                      <CInputGroup style={{display:"flex",alignItems:"center",marginTop:reasonInputField.reason_no>1?"0.5rem":"none"}}>
                         <CInput
                              onChange={(e) => handleChangeReasonFieldValue(index,e)}
                              value={reasonInputField.reason_value}
                              type="reasonInputField"
                              id={`reason${reasonInputField.reason_no}`}
                              name={`reason${reasonInputField.reason_no}`}
                              placeholder={`Enter reason ${reasonInputField.reason_no}`}
                              //required
                          />                          
                                            <CInputGroupAppend style={{display:reasonInputFields.length>1?"":"none"}}>                              
                                                    <CBadge style={{marginLeft:"0.5rem", cursor:"pointer"}} color="danger" onClick={()=>handleRemoveReasonField(index)}><FaMinus/></CBadge>
                                            </CInputGroupAppend>
                                            </CInputGroup>
                                            <div style={{ color: "red", marginLeft: "0.1rem", display: reasonInputField.check ? "" : "none" }}>Reason { reasonInputField.reason_no} is required</div>
                                        </>
                                        )
                                        })}
                                        <div style={{ color: "red", marginLeft: "0.1rem", display: reasonInputFieldsCheck ? "" : "none" }}>Atleast two reason are required</div>
                                        <CBadge
                                        style={{ marginTop: "0.5rem", cursor: "pointer", }}
                                        color="secondary"
                                        onClick={handleAddReasonField}
                                        ><FaPlus /></CBadge>
                                            
                                        </CFormGroup>
                                        
                                <CFormGroup>
                                    
                                        <CLabel style={{ fontWeight: "600", fontSize: "1rem" }} htmlFor="weight_gain_range">Weight Gain Range:</CLabel>
                                    
                                        <div style={{ width: "45%",display: "flex", justifyConten:"space-between"  }}>
                                            <div style={{ width: "45%" }}>
                                                <CInput
                                                    onChange={(e) => {
                                                    setWeightFromCheck(false)
                                                    setWeightRangeCheck(false)
                                                        setWeightFrom(e.target.value)
                                                    }}
                                                    value={weightFrom}
                                                    type="text"
                                                    id="weight_from"
                                                    name="weight_from"
                                                    placeholder="Enter weight from"
                                                    //required
                                                        />
                                                    
                                            <div style={{ color: "red", marginLeft: "0.1rem", display: weightFromCheck.required ? "" : "none" }}>Weight from is required</div>
                                            <div style={{ color: "red", marginLeft: "0.1rem", display: weightFromCheck.numeric ? "" : "none" }}>Weight from must be numeric</div>
                                                    </div>
                                                    <div style={{width:"10%",fontSize: "1rem",textAlign:"center"}}>TO</div>
                                                <div style={{width:"45%"}}>
                                                <CInput
                                                    onChange={(e) => {
                                                        setWeightToCheck(false)
                                                        setWeightRangeCheck(false)
                                                        setWeightTo(e.target.value)
                                                    }}
                                                    value={weightTo}
                                                    type="text"
                                                    id="weight_to"
                                                    name="weight_to"
                                                    placeholder="Enter weight to"
                                                    //required
                                                />
                                            <div style={{ color: "red", marginLeft: "0.1rem", display: weightToCheck.required ? "" : "none" }}>Weight to name is required</div>
                                            <div style={{ color: "red", marginLeft: "0.1rem", display: weightToCheck.numeric ? "" : "none" }}>Weight to must be numeric</div>
                                        </div>
                                        
                                        </div>
                                        <div style={{ color: "red", marginLeft: "0.1rem", display: weightRangeCheck ? "" : "none" }}>Weight from should be less than weight to</div>
                                      
                        
                                    </CFormGroup>
          
                                                    
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <CFormGroup  style={{width:"45%"}}>
                            
                                            <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="color_code">Color Code:</CLabel>
                                            <CSelect
                                        onChange={(e) => {
                                            setColorCodeCheck(false)
                                            setColorCode(e.target.value)
                                        }}
                                            value={colorCode}
                                            id="color_code"
                                            name="color_code"
                                            style={{ backgroundColor:colorCode>0?colorCodeList.find((color)=>color.id==colorCode).name:"",color:colorCode>0?"#fff":""}}
                                            custom
                                            required
                                            
                                            > <option value="0" defaultValue>Select Color Code</option>
                                            {colorCodeList.map((colorCode) => {
                                                return <option style={{ backgroundColor:colorCode.name,color:"#fff"}} key={colorCode.id} value={colorCode.id}> {colorCode.name}</option>
                                            })}
                                        </CSelect>
                                        <div style={{color:"red",marginLeft:"0.1rem", display:colorCodeCheck?"":"none"}}>Color code is required</div>
                                        </CFormGroup>
                                                        
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
                                            required
                                            
                                            > <option value="0" defaultValue>Select Phase</option>
                                            {phaseList.map((phase) => {
                                                return <option key={phase.id} value={phase.id}> {phase.phase_name}</option>
                                            })}
                                        </CSelect>
                                        <div style={{color:"red",marginLeft:"0.1rem", display:phaseCheck?"":"none"}}>Phase is required</div>
                                        </CFormGroup>
                                        
                                                    </div>
                                                    
                                    
                                    <CFormGroup style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                                        <CButton
                                        disabled={spinnerShow}
                                        style={{ width: "5rem", marginRight:"3rem",backgroundColor: "#008080", color: "#fff" }}
                                        type="submit"
                                        >{spinnerShow?<CSpinner style={{ color: "#fff"}} size="sm" />:"Save"}</CButton>
                                        <CButton style={{width:"5rem",marginLeft:"3rem"}} color="danger" onClick={(e)=>history.goBack()} >Cancel</CButton>
                                    </CFormGroup>
                                    
                                    </CForm>
                                </CCardBody>
                                </CCard>
                            </CCol>
                        </CRow>
                        </CContainer>
                    )
  
}

export default AddEditWeightGainReason