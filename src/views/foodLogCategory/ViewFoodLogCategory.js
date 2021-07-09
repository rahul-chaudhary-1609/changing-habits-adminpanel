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
   
} from "@coreui/react"
import CIcon from "@coreui/icons-react";
import {listPhases,getFoodLogCategory} from "../../data/foodLogCategory"


function ViewFoodLogCategory(props) {
 let history = useHistory();
  let params = useParams();

let [categoryName,setCategoryName ] = useState("");
  let [phase,setPhase] = useState(1);
  let [errorResponse, setErrorResponse] = useState({
        message: null,
        code: null,
        isFound: false,
  });
  

  let [phases, setPhases] = useState([])
  let [spinnerShow,setSpinnerShow]=useState(false)



    useEffect(() => {
      setSpinnerShow(true)
    listPhases().then((response) => {
        setPhases(response.phasesList.map((phaseItem) => phaseItem.phase_name))
        setSpinnerShow(false)
        }).catch((error) => {
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


    return (
    <CContainer fluid>
      <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                  <h2>
                    View Food Log Category
                    <CSpinner style={{color:"#008080", marginLeft:"2rem", display:spinnerShow?"":"none"}} /></h2>
                  <div style={{display:"flex",justifyContent:"end"}}>  
                  <CButton
                        
                        style={{marginRight:"2rem", width: "5rem",backgroundColor:"#008080",color:"#fff" }}
                        onClick={()=>history.push(`/editFoodLogCategory/${params.id}`)}
                    >
                        <strong>Edit</strong>
                  </CButton>
                  <CButton
                        
                        style={{ width: "5rem",backgroundColor:"#008080",color:"#fff" }}
                        onClick={()=>history.goBack()}
                    >
                        <strong>Back</strong>
                    </CButton>
                    </div>
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
                      <td>{phases[phase-1]}</td>
                      </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}} htmlFor="question">Category Name</CLabel></td>
                          <td>:</td>
                      <td>{categoryName}</td>
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

export default ViewFoodLogCategory