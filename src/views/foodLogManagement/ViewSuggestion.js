import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import {    
    CCardBody,
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CLabel,
  CButton,
  CSpinner,
  CInput,
    CInputGroup
   
} from "@coreui/react"
import CIcon from "@coreui/icons-react";
import { listPhases,getFoodTypeByPhaseId, getFoodLogSuggestion } from "../../data/foodLogManagement";
import { getPhaseDays } from "../../data/learningContentManagement";
import { checkLeapYear, unitList } from "../../utils/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";


function ViewFoodLogSuggestion(props) {
 let history = useHistory();
  let params = useParams();

  let [inputGroups,setInputGroups]=useState([{
    inputGroup_no:1,phase:0,phaseCheck:false,categoryList:[],category:0,categoryCheck:false,weekList:[],week:0,
  }])
  let [foodName, setFoodName] = useState("");

  let [quantityFrom, setQuantityFrom]=useState(null);
  
  let [quantityTo, setQuantityTo]=useState(null);
  
  let [quantityUnit, setQuantityUnit]=useState(null);

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
  let [spinnerShow,setSpinnerShow]=useState(false)

  useEffect(() => {
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })
  },[phaseList,inputGroups,foodName,quantityFrom,quantityTo,quantityUnit])

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
      getFoodLogSuggestion(req).then((response) => {
        setErrorResponse({ message: null, code: null, isFound: false })
        let currentInputGroups=[...inputGroups];
        currentInputGroups[0].phase=response.foodContent.phase_id;
        currentInputGroups[0].category=response.foodContent.foodtype_id;
        currentInputGroups[0].week=response.foodContent.week_selected;
        setInputGroups(currentInputGroups);
        handlePhaseChange(0);
        setFoodName(response.foodContent.food_name)
        setQuantityFrom(response.foodContent.quantity_from)
        setQuantityTo(response.foodContent.quantity_to)
        setQuantityUnit(response.foodContent.unit)
        setSpinnerShow(false)
        
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }
  }, [])

  let handlePhaseChange=(index)=>{
    let currentInputGroups=[...inputGroups];
    if (currentInputGroups[index].phase > 0) {
      let req = {
        pathParams: {
          id: currentInputGroups[index].phase,
        },
      }
      setSpinnerShow(true)
      getFoodTypeByPhaseId(req).then((response) => {
        setSpinnerShow(false)
        currentInputGroups[index].categoryList=response.foodTypeList.rows;
        setErrorResponse({ message: null, code: null, isFound: false })
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
      setSpinnerShow(true)
      getPhaseDays(req).then((response) => {
        setSpinnerShow(false)
        let newWeekList = []
        let limit = response.phaseDays ? response.phaseDays : checkLeapYear(new Date().getFullYear()) ? 366 : 365;
        for (let i = 1; i <= Math.ceil(limit/7); i++) {
          newWeekList.push({ id: i, name: `Week ${i}`, })
        }
        currentInputGroups[index].weekList=[...newWeekList];
        setErrorResponse({ message: null, code: null, isFound: false })
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }else {
      currentInputGroups[index].categoryList=[];
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
                    <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="phase">Phase</CLabel></td>
                    <td>:</td>
                      <td>{phaseList.find((item)=>item.id==inputGroups[0].phase)?.phase_name || ""}</td>
                      </tr>
                      <tr>
                    <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="category">Category</CLabel></td>
                    <td>:</td>
                      <td>{inputGroups[0].categoryList.find((item)=>item.id==inputGroups[0].category)?.food_type || ""}</td>
                      </tr>
                      <tr>
                    <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="week">Week</CLabel></td>
                    <td>:</td>
                      <td>{inputGroups[0].weekList.find((item)=>item.id==inputGroups[0].week)?.name || "N/A"}</td>
                      </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="food_name">Food Name</CLabel></td>
                          <td>:</td>
                      <td>{foodName}</td>
                      </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="quantity_from">Quantity From</CLabel></td>
                          <td>:</td>
                      <td>{quantityFrom}</td>
                      </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="quantity_to">Quantity To</CLabel></td>
                          <td>:</td>
                      <td>{quantityTo}</td>
                      </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="unit">Quantity Unit</CLabel></td>
                          <td>:</td>
                      <td>{quantityUnit}</td>
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

export default ViewFoodLogSuggestion