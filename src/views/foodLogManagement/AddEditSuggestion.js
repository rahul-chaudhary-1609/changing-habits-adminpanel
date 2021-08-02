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
  CBadge,
} from "@coreui/react"
import {listPhases,getFoodTypeByPhaseId,getFoodLogSuggestion,addFoodLogSuggestion,editFoodLogSuggestion} from "../../data/foodLogManagement"
import { FaPlus, FaMinus } from 'react-icons/fa';
import { getPhaseDays } from "../../data/learningContentManagement"
import { checkLeapYear, unitList } from "../../utils/helper";

function AddEditFoodLogSuggestion() {
  let history = useHistory();
  let params = useParams();

  let [phase, setPhase] = useState(0);
  let [phaseCheck, setPhaseCheck] = useState(false);
  let [category, setCategory] = useState(0);
  let [categoryCheck, setCategoryCheck] = useState(false);
  let [week, setWeek] = useState(0);
  //let [weekCheck, setWeekCheck] = useState(false);
  let [foodName, setFoodName] = useState("");
  let [foodNameCheck, setFoodNameCheck] = useState(false);
  let [quantityInputFields, setQuantityInputFields] = useState(
    [
      { quantity_no: 1, quantity:null,unit:"none",check:false, validationMsg:null },
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
    // { id: 1, name: "Week 1", },
    // { id: 2, name: "Week 2" },
    // { id: 3, name: "Week 3" },
    // { id: 4, name: "Week 4" },
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
          return { quantity_no: ++index, quantity:quantity.quantity,unit:quantity.unit, check: false, validationMsg:null };
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
      setSpinnerShow(true)
      getPhaseDays(req).then((response) => {
        setSpinnerShow(false)
        let newWeekList = []
        let limit = response.phaseDays ? response.phaseDays : checkLeapYear(new Date().getFullYear()) ? 366 : 365;
        for (let i = 1; i <= Math.ceil(limit/7); i++) {
          newWeekList.push({ id: i, name: `Week ${i}`, })
        }
        setWeekList([...newWeekList]);
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
    currentQuantityInputFields.push({ quantity_no: currentQuantityInputFields.length + 1, quantity:null,unit:"none", check: false, validationMsg:null })
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

  let handleChangeQuantityFieldValue = (index, e, field) => {
    console.log(e.target.value,typeof e.target.value,isNaN(e.target.value))
    let currentQuantityInputFields = [...quantityInputFields];
    if (field == "quantity") {
      if (!e.target.value) {
        currentQuantityInputFields[index].quantity = e.target.value;
        currentQuantityInputFields[index].check = true;
        currentQuantityInputFields[index].validationMsg = `Quantity ${currentQuantityInputFields[index].quantity_no} value is required`;
      }else {
        currentQuantityInputFields[index].quantity = e.target.value;
        currentQuantityInputFields[index].check = false;
        currentQuantityInputFields[index].validationMsg = null;
      }
    }
    else if (field == "unit") {
      currentQuantityInputFields[index].unit = e.target.value;
      currentQuantityInputFields[index].check = false;
      currentQuantityInputFields[index].validationMsg = null;
    }
    
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

    // if (!week || week == 0) {
    //   setWeekCheck(true)
    //   result=false
    // }

    let currentQuantityInputFields = [...quantityInputFields]
    for (let quantityInputField of currentQuantityInputFields) {
      console.log(quantityInputField)
      if (quantityInputField.check) {
        result = false
        continue
      }else if ((!quantityInputField.quantity && !quantityInputField.unit) || (quantityInputField.quantity == 0 && quantityInputField.unit=="none")) {
        quantityInputField.check = true;
        quantityInputField.validationMsg = null;
        result=false
      } else if(!quantityInputField.quantity || quantityInputField.quantity == 0){
        quantityInputField.check = true;
        quantityInputField.validationMsg = `Quantity ${quantityInputField.quantity_no} value is required`;
        result=false
      }else if (isNaN(quantityInputField.quantity)) {
        quantityInputField.check = true;
        quantityInputField.validationMsg = `Quantity ${quantityInputField.quantity_no} value must be numeric`;
        result=false
      }else if(!quantityInputField.unit || quantityInputField.unit=="none"){
        quantityInputField.check = true;
        quantityInputField.validationMsg = `Quantity ${quantityInputField.quantity_no} unit is required`;
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
      food_quantity: quantityInputFields.map((quantityInputField) => {
        return {
          quantity: parseFloat(quantityInputField.quantity),
          unit:quantityInputField.unit
        }
      }),
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
                <CForm action="" method="post" onSubmit={handleSubmit}  autoComplete="off">
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
                        //setWeekCheck(false)
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
                    {/* <div style={{color:"red",marginLeft:"0.1rem", display:weekCheck?"":"none"}}>Week is required</div> */}
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
                              onChange={(e) => handleChangeQuantityFieldValue(index,e,"quantity")}
                              value={quantityInputField.quantity}
                              type="text"
                              id={`quantity${quantityInputField.quantity_no}`}
                              name={`quantity${quantityInputField.quantity_no}`}
                              placeholder={`Enter quantity ${quantityInputField.quantity_no}`}
                              //required
                          />                          
                          <CInputGroupAppend style={{ display:"flex", justifyContent:"start",alignItems:"center" }}>
                          <div>
                              <CSelect custom className="selectpicker"
                              onChange={(e) => handleChangeQuantityFieldValue(index,e,"unit")}
                                    value={quantityInputField.unit}
                                    id={`unit${quantityInputField.quantity_no}`}
                                    name={`unit${quantityInputField.quantity_no}`}                                    
                                    custom
                                    required>
                                <option value="none" defaultValue>Select Unit</option>
                                    <optgroup label="Volume">
                                      {unitList.filter(unit => unit.label == "volume").map((unit) => {
                                   return( <option key={unit.id} value={unit.name}>{unit.name}</option>)
                                  })} 
                                    </optgroup>
                                    <optgroup label="Weight">
                                      {unitList.filter(unit => unit.label == "weight").map((unit) => {
                                    return( <option key={unit.id} value={unit.name}>{unit.name}</option>)
                                  })} 
                                </optgroup>
                                 <optgroup label="Other">
                                      {unitList.filter(unit => unit.label == "other").map((unit) => {
                                    return( <option key={unit.id} value={unit.name}>{unit.name}</option>)
                                  })} 
                                    </optgroup>
                                  </CSelect>

                              </div> 
                                <div><CBadge style={{marginLeft:"0.5rem", cursor:"pointer",display: quantityInputFields.length > 1 ? "" : "none"}} color="danger" onClick={()=>handleRemoveQuantityField(index)}><FaMinus/></CBadge></div>
                          </CInputGroupAppend>
                        </CInputGroup>
                        <div style={{ color: "red", marginLeft: "0.1rem", display: quantityInputField.check ? "" : "none" }}>{quantityInputField.validationMsg?quantityInputField.validationMsg:`Quantity  ${quantityInputField.quantity_no} is required`}</div>
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