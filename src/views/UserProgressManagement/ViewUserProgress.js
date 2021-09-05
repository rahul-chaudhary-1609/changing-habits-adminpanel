import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import {    
    CFormText,
    CCardBody,
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CLabel,
  CButton,
  CTextarea,
  CSpinner,
  CTooltip
   
} from "@coreui/react"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CIcon from "@coreui/icons-react";
import MediaView from "src/utils/components/mediaView";
import { getUserProgress } from "../../data/userProgressManagement"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft,faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

function ViewUserProgress(props) {
  let history = useHistory();
  let params = useParams();

  let [name,setName]=useState(null);
  let [calenderDate,setCalenderDate]=useState(new Date());
  let [date,setDate]=useState(moment(calenderDate.toLocaleDateString(),"MM/DD/YYYY").format("Do MMMM, YYYY"));
  let [showCalender,setShowCalender]=useState(false)
  let [stepCount,setStepCount]=useState(null);
  let [sleepCount,setSleepCount]=useState(null);
  let [exercise,setExercise]=useState(null);
  let [targetWeight,setTargetWeight]=useState(null);
  let [currentWeight,setCurrentWeight]=useState(null);
  let [waterConsumption,setWaterConsumption]=useState(null);
  let [recipeName,setRecipeName]=useState(null);
  let [foodLogs,setFoodLogs]=useState([]);

 let [errorResponse, setErrorResponse] = useState({
        message: null,
        code: null,
        isFound: false,
 });
  let [spinnerShow,setSpinnerShow]=useState(false)
  
  useEffect(() => {
    if (params.id) {
      let req = {
        queryParams: {
            user_id:parseInt(params.id),
            date:moment(calenderDate.toLocaleDateString(),"MM/DD/YYYY").format("YYYY-MM-DD")
        },
      }
      setSpinnerShow(true);
      getUserProgress(req).then((response) => {
        setName(response.userProgressData[0].name || "---");
        setStepCount(response.userProgressData[0].step_count || "---");
        setSleepCount(response.userProgressData[0].sleep_count || "---");
        setExercise(response.userProgressData[0].exercise || "---");
        setCurrentWeight(response.userProgressData[0].current_weight || "---");
        setTargetWeight(response.userProgressData[0].target_weight || "---");
        setWaterConsumption(response.userProgressData[0].water_consumption || "---");
        setRecipeName(response.userProgressData[0].recipe_name || "---");
        setFoodLogs(response.userProgressData[0].food_log || []);
        console.log("User Progress", response)
        setSpinnerShow(false)
      }).catch((error) => {
        setSpinnerShow(false);
        setErrorResponse({ message: error.message || null, code: error.status || null, isFound: true })
      })
    }
  },[date])


  


    return (
    <CContainer fluid>
      <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                  <h2>
                    View User Progress
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
                  

                  <div style={{width:"100%",display:"flex", justifyContent:"space-between"}}>
                    <div style={{display:"flex",borderBottom:"2px solid rgba(0,0,0,0.3)"}}>
                      <div style={{fontWeight:"800",fontSize:"1rem"}}>Name :</div>
                      <div style={{fontWeight:"600",fontSize:"1rem",marginLeft:"0.5rem"}}>{name}</div>
                    </div>
                    <div style={{display:"flex",borderBottom:"2px solid rgba(0,0,0,0.3)"}}>
                      <div style={{fontWeight:"800",fontSize:"1rem"}}>Date :</div>
                      <div style={{fontWeight:"600",fontSize:"1rem",marginLeft:"0.5rem"}}>{date}</div>
                      <div style={{fontWeight:"600",fontSize:"1rem",marginLeft:"1rem",borderBottom:"none"}}>
                      <CTooltip content={`Change Date`} placement={"top-start"}>
                        <FontAwesomeIcon
                          color="white"
                          size="lg"
                          style={{ cursor: "pointer", color: "black" }}
                          icon={faCalendarAlt}
                          onClick={()=>{
                            setShowCalender(!showCalender);
                          }}
                        />
                        </CTooltip>
                        </div>
                    </div>
                  </div>    
                  <div style={{position:"absolute",right:"1rem", display:showCalender?"":"none",marginTop:"1rem"}}>
                          <Calendar
                            onChange={(e)=>{
                              setCalenderDate(e);
                              setDate(moment(e.toLocaleDateString(),"MM/DD/YYYY").format("Do MMMM, YYYY"));
                              setShowCalender(false);
                            }}
                            value={calenderDate}
                          />
                        </div>
                      
                  <div style={{display:"flex", justifyContent:"center", marginTop:"2rem"}} > 
                  <table cellpadding="5" cellSpacing="10">
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}}>Step Count</CLabel></td>
                          <td>:</td>
                      <td>{stepCount}</td>
                      </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}}>Sleep Count</CLabel></td>
                          <td>:</td>
                      <td>{sleepCount}</td>
                      </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}}>Exercise</CLabel></td>
                          <td>:</td>
                      <td>{exercise}</td>
                      </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}}>Current Weight</CLabel></td>
                          <td>:</td>
                      <td>{currentWeight}</td>
                      </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}}>Target Weight</CLabel></td>
                          <td>:</td>
                      <td>{targetWeight}</td>
                      </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}}>Water Consumption</CLabel></td>
                          <td>:</td>
                      <td>{waterConsumption}</td>
                      </tr>
                      <tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}}>Recipe name</CLabel></td>
                          <td>:</td>
                      <td>{recipeName}</td>
                      </tr><tr>
                          <td><CLabel style={{fontWeight:"600",fontSize:"1rem"}}>Food Logs</CLabel></td>
                          <td>:</td>
                      <td><div style={{border:"2px solid rgba(0,0,0,0.2)", padding:"10px 20px 0px 10px", borderRadius:"5px", maxHeight:"100px", overflow:"scroll"}}><table cellpadding="5" cellSpacing="10"> {foodLogs.map((foodLog, index) => {
                      
                      return (
                            <tr>
                                <td><CLabel style={{fontWeight:"600",fontSize:"0.9rem"}}>{foodLog.food_type}</CLabel></td>
                                <td>:</td>
                            <td>{foodLog.food_quantity} {foodLog.food_measurement_unit} {foodLog.food_name}</td>
                            </tr>
                        )
                  })}</table></div></td>
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

export default ViewUserProgress