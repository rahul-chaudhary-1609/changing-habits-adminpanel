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
import { listPhases,getFoodTypeByPhaseId, getFoodLogSuggestion } from "../../data/foodLogManagement"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";


function ViewFoodLogSuggestion(props) {
 let history = useHistory();
  let params = useParams();

  let [phase, setPhase] = useState(0);
  let [category, setCategory] = useState(0);
  let [week, setWeek] = useState(0);
  let [foodName, setFoodName] = useState("");
  let [quantityInputFields, setQuantityInputFields] = useState(
    [
      { quantity_no: 1, quantity_value: "",check:false },
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
  let [categoryList, setCategoryList] = useState([])
  let [weekList, setWeekList] = useState([
    { id: 1, name: "Week 1", },
    { id: 2, name: "Week 2" },
    { id: 3, name: "Week 3" },
    { id: 4, name: "Week 4" },
  ])
  let [spinnerShow,setSpinnerShow]=useState(false)
  //let spinnerShow = false;

  useEffect(() => {
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })
  },[phase,phaseList,categoryList,weekList,category,week,foodName,quantityInputFields])

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
        setPhase(response.foodContent.phase_id)
        setCategory(response.foodContent.foodtype_id)
        setWeek(response.foodContent.week_selected)
        setFoodName(response.foodContent.food_name)
        let currentQuantityInputFields= response.foodContent.food_quantity.map((quantity,index) => {
          return { quantity_no: ++index, quantity_value: quantity, check: false };
        })
        setQuantityInputFields([...currentQuantityInputFields]);
        setSpinnerShow(false)
        
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }
  }, [])

    useEffect(() => {
    if (phase > 0) {
      let req = {
        pathParams: {
          id: phase,
        },
      }
      setSpinnerShow(true)
      getFoodTypeByPhaseId(req).then((response) => {
        setSpinnerShow(false)
        setCategoryList(response.foodTypeList)
        setErrorResponse({ message: null, code: null, isFound: false })
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }else {
      setCategoryList([]);
    }
  }, [phase])






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
                      <td>{phaseList.find((item)=>item.id==phase)?.phase_name || ""}</td>
                      </tr>
                      <tr>
                    <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="category">Category</CLabel></td>
                    <td>:</td>
                      <td>{categoryList.find((item)=>item.id==category)?.food_type || ""}</td>
                      </tr>
                      <tr>
                    <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="week">Week</CLabel></td>
                    <td>:</td>
                      <td>{weekList.find((item)=>item.id==week)?.name || ""}</td>
                      </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="food_name">Food Name</CLabel></td>
                          <td>:</td>
                      <td>{foodName}</td>
                      </tr>
                    <tr>
                      <td><CLabel style={{ fontWeight: "600", fontSize: "1rem" }} htmlFor="quantity">Quantity:</CLabel></td>
                     <td>:</td>
                      <td><div style={{border:"2px solid rgba(0,0,0,0.2)", padding:"10px 10px 0px 0px", borderRadius:"5px"}}><ul> {quantityInputFields.map((quantityInputField, index) => {
                      
                        return (<>
                      
                          <li>{quantityInputField.quantity_value}</li>
                      
                      </>
                      )
                    })}</ul></div></td>
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