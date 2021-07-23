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
import { listPhases} from "../../data/foodLogManagement"
import {getReason,addReason,editReason} from "../../data/weightGainReasonManagement"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function ViewWeightGainReason() {
  let history = useHistory();
  let params = useParams();

  let [phase, setPhase] = useState(0);
  let [colorCode, setColorCode] = useState(0);
  let [weightFrom, setWeightFrom] = useState(null);
  let [weightTo, setWeightTo] = useState(null);
  let [reasonInputFields, setReasonInputFields] = useState(
    [
      { reason_no: 1, reason_value: "",check:false },
    ]
  )

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




  


    return (
    <CContainer fluid>
      <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                  <h2>
                    View Food Log Suggestion
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
                      <td><CLabel style={{ fontWeight: "600", fontSize: "1rem" }} htmlFor="reason">Reason:</CLabel></td>
                     <td>:</td>
                      <td><div style={{border:"2px solid rgba(0,0,0,0.2)", padding:"10px 20px 0px 0px", borderRadius:"5px"}}><ul> {reasonInputFields.map((reasonInputField, index) => {
                      
                        return (<>
                      
                          <li>{reasonInputField.reason_value}</li>
                      
                      </>
                      )
                    })}</ul></div></td>
                                    </tr>
                            <tr>
                    <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="weight_range">Weight Range</CLabel></td>
                    <td>:</td>
                      <td>{`${weightFrom} to ${weightTo}`}</td>
                    </tr>
                    <tr>
                    <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="color_code">Color Code</CLabel></td>
                    <td>:</td>
                      <td ><span style={{padding:"0.2rem 1rem 0.2rem 1rem",backgroundColor:colorCode>0?colorCodeList.find((item)=>item.id==colorCode)?.name:"",color:colorCode>0?"#fff":""}}>{colorCodeList.find((item)=>item.id==colorCode)?.name || ""}</span></td>
                      </tr>
                    <tr>
                    <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="phase">Phase</CLabel></td>
                    <td>:</td>
                      <td>{phaseList.find((item)=>item.id==phase)?.phase_name || ""}</td>
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

export default ViewWeightGainReason