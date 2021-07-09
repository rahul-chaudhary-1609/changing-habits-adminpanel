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
  CSpinner
} from "@coreui/react"
import {listPhases,getFoodLogCategory,addFoodLogCategory,editFoodLogCategory} from "../../data/foodLogCategory"

function AddEditFoodLogCategory() {
  let history = useHistory();
  let params = useParams();

let [categoryName,setCategoryName ] = useState("");
  let [phase,setPhase] = useState(1);
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

  let [phases, setPhases] = useState([])
  let [spinnerShow,setSpinnerShow]=useState(false)
  //let spinnerShow = false;

  useEffect(() => {
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })
  },[categoryName,phase,phases])

  useEffect(() => {
    setSpinnerShow(true)
    listPhases().then((response) => {
      setPhases(response.phasesList)
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
      getFoodLogCategory(req).then((response) => {
        setErrorResponse({ message: null, code: null, isFound: false })
        setCategoryName(response.foodType.food_type)
        setPhase(response.foodType.phase_id)
        setSpinnerShow(false)
        
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }
  }, [])


  let handleSubmit = (e) => {
    e.preventDefault();
    setSpinnerShow(true)
    setErrorResponse({ message: null, code: null, isFound: false })
    setSuccessResponse({ message: null, code: null, isFound: false })

    
    let data = {
      food_type: categoryName,
    }
    
    if (params.id) {
      data.foodType_id = phase;

      let req = {
        pathParams: {
          id: params.id,
        },
        data
      }

      editFoodLogCategory(req).then((response) => {
        setSpinnerShow(false)
        setErrorResponse({ message: null, code: null, isFound: false })
        setSuccessResponse({ message: "Updated Successfully" || null, code: 200 || null, isFound: true })
        history.push('/listFoodLogCategory')
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    } else {
      data.phase_id = phase;

      let req = {
        data
      }
      addFoodLogCategory(req).then((response) => {
        setSpinnerShow(false)
        setErrorResponse({ message: null, code: null, isFound: false })
        setSuccessResponse({ message: "Saved Successfully" || null, code: 200 || null, isFound: true })
        history.push('/listFoodLogCategory')
      }).catch((error) => {
        setSpinnerShow(false)
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }    
  }

  let handleReset = (e) => {
    e.preventDefault();
    setSpinnerShow(false)
    setCategoryName("")
    setPhase(1)  
  }

    return (
    <CContainer fluid>
      <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                  <h2>{history.location.pathname == "/addFoodLogCategory" ? "Add Food Log Category" : "Edit Food Log Category"}
                  <CSpinner style={{color:"#008080", marginLeft:"2rem", display:spinnerShow?"":"none"}} /></h2>
                    <CButton
                        style={{ width: "5rem",backgroundColor:"#008080",color:"#fff"}}
                        onClick={()=>history.goBack()}
                    >
                        <strong>Back</strong>
                    </CButton>
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
                    
                                    <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="phase">Phase:</CLabel>
                                    <CSelect
                                    onChange={(e)=>setPhase(e.target.value)}
                                    value={phase}
                                    id="phase"
                      name="phase"
                      custom
                                    required
                                    > <option value="" defaultValue disabled>Select Phase</option>
                                    {phases.map((phase) => {
                                        return <option key={phase.id} value={phase.id}> {phase.phase_name}</option>
                                    })}
                                    </CSelect>                   
                                </CFormGroup>
                                
                  <CFormGroup >                    
                      <CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="category_name">Category Name:</CLabel>
                    <CInput
                      onChange={(e) => setCategoryName(e.target.value)}
                      value={categoryName}
                      type="text"
                      id="category_name"
                      name="category_name"
                      placeholder="Enter Category Name"
                      required
                    />                    
                  </CFormGroup>

                  
                  
                  <CFormGroup style={{display:"flex", alignItems:"center", justifyContent:"space-around"}}>
                    <CButton
                      disabled={spinnerShow}
                      style={{ width: "10rem", backgroundColor: "#008080", color: "#fff" }}
                      type="submit"
                    >Save <CSpinner style={{ color: "#fff", marginLeft: "1rem", display:spinnerShow?"":"none" }} size="sm" /></CButton>
                    <CButton style={{width:"10rem"}} type="reset" color="secondary" onClick={handleReset} >Reset</CButton>
                  </CFormGroup>
                  
                  </CForm>
              </CCardBody>
            </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
  
}

export default AddEditFoodLogCategory