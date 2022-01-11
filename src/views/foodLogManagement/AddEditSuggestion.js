import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
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
} from "@coreui/react";
import {
  listPhases,
  getFoodTypeByPhaseId,
  getFoodLogSuggestion,
  addFoodLogSuggestion,
  editFoodLogSuggestion,
} from "../../data/foodLogManagement";
import { FaPlus, FaMinus } from "react-icons/fa";
import { getPhaseDays } from "../../data/learningContentManagement";
import { checkLeapYear, unitList } from "../../utils/helper";

function AddEditFoodLogSuggestion() {
  let history = useHistory();
  let params = useParams();

  let [inputGroups, setInputGroups] = useState([
    {
      inputGroup_no: 1,
      phase: 0,
      phaseCheck: false,
      categoryList: [],
      category: 0,
      categoryCheck: false,
      weekList: [],
      week: 0,
    },
  ]);

  let [foodName, setFoodName] = useState("");
  let [foodNameCheck, setFoodNameCheck] = useState(false);

  let [quantityFrom, setQuantityFrom] = useState({
    value: null,
    check: false,
    error: "Quantity from value is required",
  });

  let [quantityTo, setQuantityTo] = useState({
    value: null,
    check: false,
    error: "Quantity to value is required",
  });

  let [quantityUnit, setQuantityUnit] = useState(null);
  let [quantityUnitCheck, setQuantityUnitCheck] = useState(false);

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

  let [phaseList, setPhaseList] = useState([]);

  let [spinnerShow, setSpinnerShow] = useState(false);
  //let spinnerShow = false;

  useEffect(() => {
    setErrorResponse({ message: null, code: null, isFound: false });
    setSuccessResponse({ message: null, code: null, isFound: false });
  }, [
    phaseList,
    inputGroups,
    foodName,
    quantityFrom,
    quantityTo,
    quantityUnit,
  ]);

  useEffect(() => {
    setSpinnerShow(true);
    listPhases()
      .then((response) => {
        setPhaseList(response.phasesList);
        setSpinnerShow(false);
      })
      .catch((error) => {
        setSpinnerShow(false);
        setErrorResponse({
          message: error.message || null,
          code: error.status || null,
          isFound: true,
        });
      });

    if (params.id) {
      let req = {
        pathParams: {
          id: params.id,
        },
      };
      setSpinnerShow(true);
      getFoodLogSuggestion(req)
        .then((response) => {
          setErrorResponse({ message: null, code: null, isFound: false });
          let currentInputGroups = [...inputGroups];
          currentInputGroups[0].phase = response.foodContent.phase_id;
          currentInputGroups[0].category = response.foodContent.foodtype_id;
          currentInputGroups[0].week = response.foodContent.week_selected;
          setInputGroups(currentInputGroups);
          handlePhaseChange(0);
          setFoodName(response.foodContent.food_name);
          setQuantityFrom({
            ...quantityFrom,
            value: response.foodContent.quantity_from,
          });
          setQuantityTo({
            ...quantityTo,
            value: response.foodContent.quantity_to,
          });
          setQuantityUnit(response.foodContent.unit);
          setSpinnerShow(false);
        })
        .catch((error) => {
          setSpinnerShow(false);
          setErrorResponse({
            message: error.message || null,
            code: error.status || null,
            isFound: true,
          });
        });
    }
  }, []);

  let handlePhaseChange = (index) => {
    let currentInputGroups = [...inputGroups];
    if (currentInputGroups[index].phase > 0) {
      let req = {
        pathParams: {
          id: currentInputGroups[index].phase,
        },
      };
      setSpinnerShow(true);
      getFoodTypeByPhaseId(req)
        .then((response) => {
          setSpinnerShow(false);
          currentInputGroups[index].categoryList = response.foodTypeList.rows;
          setErrorResponse({ message: null, code: null, isFound: false });
        })
        .catch((error) => {
          setSpinnerShow(false);
          setErrorResponse({
            message: error.message || null,
            code: error.status || null,
            isFound: true,
          });
        });
      setSpinnerShow(true);
      getPhaseDays(req)
        .then((response) => {
          setSpinnerShow(false);
          let newWeekList = [];
          let limit = response.phaseDays
            ? response.phaseDays
            : checkLeapYear(new Date().getFullYear())
            ? 366
            : 365;
          for (let i = 1; i <= Math.ceil(limit / 7); i++) {
            newWeekList.push({ id: i, name: `Week ${i}` });
          }
          currentInputGroups[index].weekList = [...newWeekList];
          setErrorResponse({ message: null, code: null, isFound: false });
        })
        .catch((error) => {
          setSpinnerShow(false);
          setErrorResponse({
            message: error.message || null,
            code: error.status || null,
            isFound: true,
          });
        });
    } else {
      currentInputGroups[index].categoryList = [];
    }

    setInputGroups(currentInputGroups);
  };

  let handleAddInputGroup = () => {
    let currentInputGroups = [...inputGroups];
    currentInputGroups.push({
      inputGroup_no: inputGroups.length + 1,
      phase: 0,
      phaseCheck: false,
      categoryList: [],
      category: 0,
      categoryCheck: false,
      weekList: [],
      week: 0,
    });
    setInputGroups(currentInputGroups);
  };

  let handleRemoveInputGroup = (index) => {
    let currentInputGroups = [...inputGroups];
    currentInputGroups.splice(index, 1);
    currentInputGroups = currentInputGroups.map((currentInputGroup, key) => {
      return { ...currentInputGroup, inputGroup_no: ++key };
    });
    setInputGroups(currentInputGroups);
  };

  let handleChangeInputGroupValue = (index, e, field) => {
    let currentInputGroups = [...inputGroups];
    if (field === "phase") {
      currentInputGroups[index].category = 0;
      currentInputGroups[index].categoryCheck = false;
      currentInputGroups[index].phase = e.target.value;
      currentInputGroups[index].phaseCheck = false;
      handlePhaseChange(index);
    } else if (field === "category") {
      currentInputGroups[index].category = e.target.value;
      currentInputGroups[index].categoryCheck = false;
    } else if (field === "week") {
      currentInputGroups[index].week = e.target.value;
    }
    setInputGroups(currentInputGroups);
  };

  let validateField = () => {
    let result = true;
    if (!foodName || foodName.trim() == "") {
      setFoodNameCheck(true);
      result = false;
    }

    if (!quantityFrom.value) {
      setQuantityFrom({
        ...quantityFrom,
        check: true,
        error: "Quantity from value is required",
      });
      result = false;
    } else if (isNaN(quantityFrom.value)) {
      setQuantityFrom({
        ...quantityFrom,
        check: true,
        error: "Quantity from value must be numeric",
      });
      result = false;
    } else if (
      quantityTo.value &&
      !isNaN(quantityTo.value) &&
      parseFloat(quantityFrom.value) >= parseFloat(quantityTo.value)
    ) {
      setQuantityFrom({
        ...quantityFrom,
        check: true,
        error: "Quantity from value must be less than quantity to value",
      });
      result = false;
    }

    if (!quantityTo.value) {
      setQuantityTo({
        ...quantityTo,
        check: true,
        error: "Quantity to value is required",
      });
      result = false;
    } else if (isNaN(quantityTo.value)) {
      setQuantityTo({
        ...quantityTo,
        check: true,
        error: "Quantity to value must be numeric",
      });
      result = false;
    } else if (
      quantityFrom.value &&
      !isNaN(quantityFrom.value) &&
      parseFloat(quantityTo.value) < parseFloat(quantityFrom.value)
    ) {
      setQuantityTo({
        ...quantityTo,
        check: true,
        error: "Quantity to value must be greater than quantity from value",
      });
      result = false;
    }

    if (!quantityUnit || quantityUnit == "none") {
      setQuantityUnitCheck(true);
      result = false;
    }

    let currentInputGroups = [...inputGroups];

    currentInputGroups.forEach((currentInputGroup) => {
      if (!currentInputGroup.phase || currentInputGroup.phase == 0) {
        currentInputGroup.phaseCheck = true;
        result = false;
      }

      if (!currentInputGroup.category || currentInputGroup.category == 0) {
        currentInputGroup.categoryCheck = true;
        result = false;
      }
    });

    setInputGroups(currentInputGroups);

    return result;
  };

  let handleSubmit = (e) => {
    e.preventDefault();
    if (!validateField()) {
      return;
    }
    setSpinnerShow(true);
    setErrorResponse({ message: null, code: null, isFound: false });
    setSuccessResponse({ message: null, code: null, isFound: false });

    let data = {
      food_name: foodName,
      quantity_from: parseFloat(quantityFrom.value),
      quantity_to: parseFloat(quantityTo.value),
      unit: quantityUnit,
    };

    if (params.id) {
      data = {
        ...data,
        phase_id: inputGroups[0].phase,
        foodtype_id: inputGroups[0].category,
        week_selected: inputGroups[0].week,
      };

      let req = {
        pathParams: {
          id: params.id,
        },
        data,
      };

      editFoodLogSuggestion(req)
        .then((response) => {
          setSpinnerShow(false);
          setErrorResponse({ message: null, code: null, isFound: false });
          setSuccessResponse({
            message: "Updated Successfully" || null,
            code: 200 || null,
            isFound: true,
          });
          history.push("/listFoodLogSuggestion/foodlog");
        })
        .catch((error) => {
          setSpinnerShow(false);
          setErrorResponse({
            message: error.message || null,
            code: error.status || null,
            isFound: true,
          });
        });
    } else {
      data = {
        ...data,
        food_phase_category: inputGroups.map((inputGroup) => {
          return {
            foodtype_id: parseInt(inputGroup.category),
            phase_id: parseInt(inputGroup.phase),
            week_selected: parseInt(inputGroup.week),
          };
        }),
      };

      let req = {
        data,
      };
      addFoodLogSuggestion(req)
        .then((response) => {
          setSpinnerShow(false);
          setErrorResponse({ message: null, code: null, isFound: false });
          setSuccessResponse({
            message: "Saved Successfully" || null,
            code: 200 || null,
            isFound: true,
          });
          history.push("/listFoodLogSuggestion/foodlog");
        })
        .catch((error) => {
          setSpinnerShow(false);
          setErrorResponse({
            message: error.message || null,
            code: error.status || null,
            isFound: true,
          });
        });
    }
  };

  return (
    <CContainer fluid>
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>
                  {history.location.pathname == "/addFoodLogSuggestion"
                    ? "Add Food Log Suggestion"
                    : "Edit Food Log Suggestion"}
                  <CSpinner
                    style={{
                      color: "#008080",
                      marginLeft: "2rem",
                      display: spinnerShow ? "" : "none",
                    }}
                  />
                </h2>
                {/* <CButton
                        style={{ width: "5rem",backgroundColor:"#008080",color:"#fff"}}
                        onClick={()=>history.goBack()}
                    >
                        <strong>Back</strong>
                    </CButton> */}
              </div>
            </CCardHeader>
            <CCardBody>
              <div
                style={{
                  color: "red",
                  fontSize: "1rem",
                  display: errorResponse.isFound ? "flex" : "none",
                  justifyContent: "center",
                }}
              >
                <div>
                  <h5>{errorResponse.message}</h5>
                </div>
              </div>
              <div
                style={{
                  color: "green",
                  fontSize: "1rem",
                  display: successResponse.isFound ? "flex" : "none",
                  justifyContent: "center",
                }}
              >
                <div>
                  <h5>{successResponse.message}</h5>
                </div>
              </div>
              <CForm
                action=""
                method="post"
                onSubmit={handleSubmit}
                autoComplete="off"
              >
                {inputGroups.map((inputGroup, index) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <CFormGroup style={{ width: "30%" }}>
                        <CLabel
                          style={{ fontWeight: "600", fontSize: "1rem" }}
                          htmlFor="phase"
                        >
                          Phase
                        </CLabel>
                        <CSelect
                          onChange={(e) =>
                            handleChangeInputGroupValue(index, e, "phase")
                          }
                          value={inputGroup.phase}
                          id={`phase${inputGroup.inputGroup_no}`}
                          name={`phase${inputGroup.inputGroup_no}`}
                          custom
                          //required
                        >
                          {" "}
                          <option value="0" defaultValue>
                            Select Phase
                          </option>
                          {phaseList.map((phase) => {
                            return (
                              <option key={phase.id} value={phase.id}>
                                {" "}
                                {phase.phase_name}
                              </option>
                            );
                          })}
                        </CSelect>
                        <div
                          style={{
                            color: "red",
                            marginLeft: "0.1rem",
                            display: inputGroup.phaseCheck ? "" : "none",
                          }}
                        >
                          Phase is required
                        </div>
                      </CFormGroup>
                      <CFormGroup style={{ width: "30%" }}>
                        <CLabel
                          style={{ fontWeight: "600", fontSize: "1rem" }}
                          htmlFor="category"
                        >
                          Category
                        </CLabel>
                        <CSelect
                          onChange={(e) =>
                            handleChangeInputGroupValue(index, e, "category")
                          }
                          value={inputGroup.category}
                          id={`category${inputGroup.inputGroup_no}`}
                          name={`category${inputGroup.inputGroup_no}`}
                          custom
                          //required
                        >
                          {" "}
                          <option value="0" defaultValue>
                            Select Category
                          </option>
                          {inputGroup.categoryList.map((category) => {
                            return (
                              <option key={category.id} value={category.id}>
                                {" "}
                                {category.food_type}
                              </option>
                            );
                          })}
                        </CSelect>
                        <div
                          style={{
                            color: "red",
                            marginLeft: "0.1rem",
                            display: inputGroup.categoryCheck ? "" : "none",
                          }}
                        >
                          Category is required
                        </div>
                      </CFormGroup>
                      <CFormGroup style={{ width: "30%" }}>
                        <CLabel
                          style={{ fontWeight: "600", fontSize: "1rem" }}
                          htmlFor="week"
                        >
                          Week
                        </CLabel>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <CSelect
                            onChange={(e) =>
                              handleChangeInputGroupValue(index, e, "week")
                            }
                            value={inputGroup.week}
                            id={`week${inputGroup.inputGroup_no}`}
                            name={`week${inputGroup.inputGroup_no}`}
                            custom
                            //required
                          >
                            {" "}
                            <option value="0" defaultValue>
                              Select Week
                            </option>
                            {inputGroup.weekList.map((week) => {
                              return (
                                <option key={week.id} value={week.id}>
                                  {" "}
                                  {week.name}
                                </option>
                              );
                            })}
                          </CSelect>
                          <div
                            style={{
                              display: inputGroups.length > 1 ? "" : "none",
                            }}
                          >
                            <CBadge
                              style={{
                                marginLeft: "0.5rem",
                                marginTop: "0.5rem",
                                cursor: "pointer",
                              }}
                              color="danger"
                              onClick={() => handleRemoveInputGroup(index)}
                            >
                              <FaMinus />
                            </CBadge>
                          </div>
                        </div>
                      </CFormGroup>
                    </div>
                  );
                })}
                <CBadge
                  style={{
                    marginBottom: "1rem",
                    cursor: "pointer",
                    display: params.id ? "none" : "",
                  }}
                  color="secondary"
                  onClick={handleAddInputGroup}
                >
                  <FaPlus />
                </CBadge>

                <CFormGroup>
                  <CLabel
                    style={{ fontWeight: "600", fontSize: "1rem" }}
                    htmlFor="food_name"
                  >
                    Food Name
                  </CLabel>
                  <CInput
                    onChange={(e) => {
                      setFoodNameCheck(false);
                      setFoodName(e.target.value);
                    }}
                    value={foodName}
                    type="text"
                    id="category_name"
                    name="category_name"
                    placeholder="Enter Food Name"
                    //required
                  />
                  <div
                    style={{
                      color: "red",
                      marginLeft: "0.1rem",
                      display: foodNameCheck ? "" : "none",
                    }}
                  >
                    Food name is required
                  </div>
                </CFormGroup>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <CFormGroup style={{ width: "30%" }}>
                    <CLabel
                      style={{ fontWeight: "600", fontSize: "1rem" }}
                      htmlFor="quantity_from"
                    >
                      Quantity From
                    </CLabel>
                    <CInput
                      onChange={(e) => {
                        setQuantityFrom({
                          ...quantityFrom,
                          value: e.target.value,
                          check: false,
                        });
                      }}
                      value={quantityFrom.value}
                      type="text"
                      id="quantity_from"
                      name="quantity_from"
                      placeholder="Enter quantity from"
                      //required
                    />
                    <div
                      style={{
                        color: "red",
                        marginLeft: "0.1rem",
                        display: quantityFrom.check ? "" : "none",
                      }}
                    >
                      {quantityFrom.error}
                    </div>
                  </CFormGroup>
                  <CFormGroup style={{ width: "30%" }}>
                    <CLabel
                      style={{ fontWeight: "600", fontSize: "1rem" }}
                      htmlFor="quantity_to"
                    >
                      Quantity To
                    </CLabel>
                    <CInput
                      onChange={(e) => {
                        setQuantityTo({
                          ...quantityTo,
                          value: e.target.value,
                          check: false,
                        });
                      }}
                      value={quantityTo.value}
                      type="text"
                      id="quantity_to"
                      name="quantity_to"
                      placeholder="Enter quantity to"
                      //required
                    />
                    <div
                      style={{
                        color: "red",
                        marginLeft: "0.1rem",
                        display: quantityTo.check ? "" : "none",
                      }}
                    >
                      {quantityTo.error}
                    </div>
                  </CFormGroup>
                  <CFormGroup style={{ width: "30%" }}>
                    <CLabel
                      style={{ fontWeight: "600", fontSize: "1rem" }}
                      htmlFor="quantity_unit"
                    >
                      Quantity Unit
                    </CLabel>
                    <CSelect
                      custom
                      className="selectpicker"
                      onChange={(e) => {
                        setQuantityUnitCheck(false);
                        setQuantityUnit(e.target.value);
                      }}
                      value={quantityUnit}
                      id="quantity_unit"
                      name="quantity_unit"
                      custom
                      required
                    >
                      <option value="none" defaultValue>
                        Select Unit
                      </option>
                      <optgroup label="Volume">
                        {unitList
                          .filter((unit) => unit.label == "volume")
                          .map((unit) => {
                            return (
                              <option key={unit.id} value={unit.name}>
                                {unit.name}
                              </option>
                            );
                          })}
                      </optgroup>
                      <optgroup label="Weight">
                        {unitList
                          .filter((unit) => unit.label == "weight")
                          .map((unit) => {
                            return (
                              <option key={unit.id} value={unit.name}>
                                {unit.name}
                              </option>
                            );
                          })}
                      </optgroup>
                      <optgroup label="Other">
                        {unitList
                          .filter((unit) => unit.label == "other")
                          .map((unit) => {
                            return (
                              <option key={unit.id} value={unit.name}>
                                {unit.name}
                              </option>
                            );
                          })}
                      </optgroup>
                    </CSelect>
                    <div
                      style={{
                        color: "red",
                        marginLeft: "0.1rem",
                        display: quantityUnitCheck ? "" : "none",
                      }}
                    >
                      Quantity unit is required
                    </div>
                  </CFormGroup>
                </div>

                <CFormGroup
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CButton
                    disabled={spinnerShow}
                    style={{
                      width: "5rem",
                      marginRight: "3rem",
                      backgroundColor: "#008080",
                      color: "#fff",
                    }}
                    type="submit"
                  >
                    {spinnerShow ? (
                      <CSpinner style={{ color: "#fff" }} size="sm" />
                    ) : (
                      "Save"
                    )}
                  </CButton>
                  <CButton
                    style={{ width: "5rem", marginLeft: "3rem" }}
                    color="danger"
                    onClick={(e) => history.goBack()}
                  >
                    Cancel
                  </CButton>
                </CFormGroup>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default AddEditFoodLogSuggestion;
