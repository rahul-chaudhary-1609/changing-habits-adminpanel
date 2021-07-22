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
import {listPhases,getFoodTypeByPhaseId,getFoodLogSuggestion,addFoodLogSuggestion,editFoodLogSuggestion} from "../../data/foodLogManagement"
import { FaPlus,FaMinus } from 'react-icons/fa';

function AddEditFoodLogSuggestion() {
  let history = useHistory();
  let params = useParams();

  let [phase, setPhase] = useState(0);
  let [phaseCheck, setPhaseCheck] = useState(false);
  let [category, setCategory] = useState(0);
  let [categoryCheck, setCategoryCheck] = useState(false);
  let [week, setWeek] = useState(0);
  let [weekCheck, setWeekCheck] = useState(false);
  let [foodName, setFoodName] = useState("");
  let [foodNameCheck, setFoodNameCheck] = useState(false);
  let [quantityInputFields, setQuantityInputFields] = useState(
    [
      { quantity_no: 1, quantity_value: "",check:false },
    ]
  )
  let [quantityInputFieldsCheck, setQuantityInputFieldsCheck] = useState(false);

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

  let handleAddQuantityField = () => {
    if (quantityInputFields.length >= 0) {
      setQuantityInputFieldsCheck(false);
    }

    let currentQuantityInputFields = [...quantityInputFields];
    currentQuantityInputFields.push({ quantity_no: currentQuantityInputFields.length + 1, quantity_value: "", check: false })
    currentQuantityInputFields=currentQuantityInputFields.map((currentQuantityInputField, key) => {
      return {...currentQuantityInputField,quantity_no:++key}
    })
    setQuantityInputFields(currentQuantityInputFields)
  }

  let handleRemoveQuantityField = (index) => {
    if (quantityInputFields.length < 2) {
      setQuantityInputFieldsCheck(true);
    }
    let currentQuantityInputFields = [...quantityInputFields];
    currentQuantityInputFields.splice(index, 1);
    currentQuantityInputFields=currentQuantityInputFields.map((currentQuantityInputField, key) => {
      return {...currentQuantityInputField,quantity_no:++key}
    })
    setQuantityInputFields(currentQuantityInputFields)
  }

  let handleChangeQuantityFieldValue = (index, e) => {
    let currentQuantityInputFields = [...quantityInputFields];
    currentQuantityInputFields[index].quantity_value = e.target.value;
    currentQuantityInputFields[index].check = false;
    setQuantityInputFields(currentQuantityInputFields)
  }

  let validateField = () => {
    let result = true;
    if (!foodName || foodName.trim() == "") {
      setFoodNameCheck(true)
      result=false
    }
    if (!phase || phase == 0) {
      setPhaseCheck(true)
      result=false
    }

    if (!category || category == 0) {
      setCategoryCheck(true)
      result=false
    }

    if (!week || week == 0) {
      setWeekCheck(true)
      result=false
    }

    let currentQuantityInputFields = [...quantityInputFields]
    for (let quantityInputField of currentQuantityInputFields) {
      if (!quantityInputField.quantity_value || quantityInputField.quantity_value.trim() == "") {
        quantityInputField.check = true;
        result=false
      }
    }
    setQuantityInputFields(currentQuantityInputFields);
    
    if (quantityInputFields.length<1) {
      setQuantityInputFieldsCheck(true)
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
      phase_id: phase,
      foodtype_id : category,
      week_selected : week,
      food_name: foodName,
      food_quantity: quantityInputFields.map(quantityInputField=>quantityInputField.quantity_value),
    }
    
    if (params.id) {

      let req = {
        pathParams: {
          id: params.id,
        },
        data
      }

      editFoodLogSuggestion(req).then((response) => {
        setSpinnerShow(false)
        setErrorResponse({ message: null, code: null, isFound: false })
        setSuccessResponse({ message: "Updated Successfully" || null, code: 200 || null, isFound: true })
        history.push('/listFoodLogSuggestion')
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    } else {
        
      let req = {
        data
      }
      addFoodLogSuggestion(req).then((response) => {
        setSpinnerShow(false)
        setErrorResponse({ message: null, code: null, isFound: false })
        setSuccessResponse({ message: "Saved Successfully" || null, code: 200 || null, isFound: true })
        history.push('/listFoodLogSuggestion')
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
                  <h2>{history.location.pathname == "/addFoodLogSuggestion" ? "Add Food Log Suggestion" : "Edit Food Log Suggestion"}
                  <CSpinner style={{color:"#008080", marginLeft:"2rem", display:spinnerShow?"":"none"}} /></h2>
                    {/* <CButton
                        style={{ width: "5rem",backgroundColor:"#008080",color:"#fff"}}
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
                <CForm action="" method="post" onSubmit={handleSubmit}>
                  <div style={{display:"flex", justifyContent:"space-between"}}>
                      <CFormGroup style={{width:"30%"}}>
          
                          <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="phase">Phase:</CLabel>
                          <CSelect
                        onChange={(e) => {
                        setCategory(0)
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
                    <CFormGroup  style={{width:"30%"}}>
          
                          <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="category">Category:</CLabel>
                          <CSelect
                      onChange={(e) => {
                        setCategoryCheck(false)
                        setCategory(e.target.value)
                      }}
                          value={category}
                          id="category"
                          name="category"
                          custom
                          required
                          
                          > <option value="0" defaultValue>Select Category</option>
                          {categoryList.map((category) => {
                              return <option key={category.id} value={category.id}> {category.food_type}</option>
                          })}
                    </CSelect>
                    <div style={{color:"red",marginLeft:"0.1rem", display:categoryCheck?"":"none"}}>Category is required</div>
                    </CFormGroup>
                    <CFormGroup  style={{width:"30%"}}>
          
                          <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="week">Week:</CLabel>
                          <CSelect
                      onChange={(e) => {
                        setWeekCheck(false)
                        setWeek(e.target.value)
                      }}
                          value={week}
                          id="week"
                          name="week"
                          custom
                          required
                          
                          > <option value="0" defaultValue>Select Week</option>
                          {weekList.map((week) => {
                              return <option key={week.id} value={week.id}> {week.name}</option>
                          })}
                    </CSelect>
                    <div style={{color:"red",marginLeft:"0.1rem", display:weekCheck?"":"none"}}>Week is required</div>
                      </CFormGroup>
                                </div>
                  <CFormGroup >                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="food_name">Food Name:</CLabel>
                    <CInput
                      onChange={(e) => {
                        setFoodNameCheck(false)
                        setFoodName(e.target.value)
                      }}
                      value={foodName}
                      type="text"
                      id="category_name"
                      name="category_name"
                      placeholder="Enter Food Name"
                      //required
                    />
                    <div style={{color:"red",marginLeft:"0.1rem", display:foodNameCheck?"":"none"}}>Food name is required</div>
                  </CFormGroup>

                  <CFormGroup>
                    <CLabel style={{ fontWeight: "600", fontSize: "1rem" }} htmlFor="quantity">Quantity:</CLabel>
                    {quantityInputFields.map((quantityInputField, index) => {
                      return (<>
                      <CInputGroup style={{display:"flex",alignItems:"center",marginTop:quantityInputField.quantity_no>1?"0.5rem":"none"}}>
                         <CInput
                              onChange={(e) => handleChangeQuantityFieldValue(index,e)}
                              value={quantityInputField.quantity_value}
                              type="quantityInputField"
                              id={`quantity${quantityInputField.quantity_no}`}
                              name={`quantity${quantityInputField.quantity_no}`}
                              placeholder={`Enter quantity ${quantityInputField.quantity_no}`}
                              //required
                          />                          
                          <CInputGroupAppend style={{display:quantityInputFields.length>1?"":"none"}}>                              
                                <CBadge style={{marginLeft:"0.5rem", cursor:"pointer"}} color="danger" onClick={()=>handleRemoveQuantityField(index)}><FaMinus/></CBadge>
                          </CInputGroupAppend>
                        </CInputGroup>
                        <div style={{ color: "red", marginLeft: "0.1rem", display: quantityInputField.check ? "" : "none" }}>Quantity { quantityInputField.quantity_no} is required</div>
                      </>
                      )
                    })}
                    <div style={{ color: "red", marginLeft: "0.1rem", display: quantityInputFieldsCheck ? "" : "none" }}>Atleast two quantity are required</div>
                    <CBadge
                      style={{ marginTop: "0.5rem", cursor: "pointer" }}
                      color="secondary"
                      onClick={handleAddQuantityField}
                    ><FaPlus /></CBadge>
                          
                  </CFormGroup>

                  
                  
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

export default AddEditFoodLogSuggestion