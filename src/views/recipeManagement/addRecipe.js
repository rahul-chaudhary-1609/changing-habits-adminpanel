import React, { useState, useEffect,useRef } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormGroup,
  CInput,
  CLabel,
  CTextarea,
  CInputFile,
  CSelect,
  CInputGroup,
  CInputGroupAppend,
  CBadge,
} from "@coreui/react";

import { uploadImage, SavePost, EditPost, GetRecipeDetail } from "../../api";
import { useLocation, useHistory, useParams } from "react-router-dom";
import FormData from "form-data";
import { unitList } from "../../utils/helper";
import { FaPlus, FaMinus } from "react-icons/fa";
import { CustomEditor } from "src/utils/components/customEditor";

export default function AddRecipe() {
  const location = useLocation();
  const history = useHistory();
  const params = useParams();
  let customEditorRef = useRef();

  var phase = [
    {
      label: "Kickstart",
      value: 1,
    },
    {
      label: "Phase 1",
      value: 2,
    },

    {
      label: "Phase 2",
      value: 3,
    },
    {
      label: "Phase 3",
      value: 4,
    },
    {
      label: "Phase 4",
      value: 5,
    },
    {
      label: "Phase 4 eva",
      value: 6,
    },
  ];

  var type = [
    {
      label: "Vegetarian",
      value: 1,
    },
    {
      label: "Non Vegetarian",
      value: 2,
    },

    {
      label: "Snacks",
      value: 3,
    },
    {
      label: "Desserts",
      value: 4,
    },
    {
      label: "Free Foods",
      value: 5,
    },
    {
      label: "Fruits",
      value: 6,
    },
  ];

  var vegType = [
    {
      label: "Eggs",
      value: 15,
    },
    {
      label: "Fish",
      value: 11,
    },

    {
      label: "Seafood",
      value: 12,
    },
    {
      label: "Legumes",
      value: 13,
    },
    {
      label: "Vegetables",
      value: 14,
    },
  ];

  var nonVegType = [
    {
      label: "Chicken",
      value: 21,
    },
    {
      label: "Beef",
      value: 22,
    },

    {
      label: "Lamb",
      value: 23,
    },
    {
      label: "Pork",
      value: 24,
    },
    {
      label: "Turkey",
      value: 25,
    },
  ];

  const [disable, setDisable] = useState(false);
  const [recipeType, setRecipeType] = useState(1);
  const [image, setImage] = useState({});
  let [description, setDescription] = useState("");
  let [descriptionCheck, setDescriptionCheck] = useState(false);

  let [quantityInputFields, setQuantityInputFields] = useState([
    {
      quantity_no: 1,
      ingredient: "",
      quantity: null,
      unit: "none",
      check: false,
      validationMsg: null,
    },
  ]);

  const [show, setShow] = useState({
    recipe_sub_type: "",
    recipe_type: "",
    phase_id: "",
    recipe_image_url: "",
    serves_quantity: null,
    recipe_title: "",
    // recipe_methods: "",
  });

  const [error, setError] = useState({
    phase_id: {
      error: "",
      blur: "",
    },
    recipe_sub_type: {
      error: "",
      blur: "",
    },
    recipe_type: {
      error: "",
      blur: "",
    },
    recipe_image_url: {
      error: "",
      blur: "",
    },
    recipe_title: {
      error: "",
      blur: "",
    },
    serves_quantity: {
      error: "",
      blur: "",
    },
    recipe_methods: {
      error: "",
      blur: "",
    },
  });

  const [loading, setLoading] = useState(false);
  let [quantityInputFieldsCheck, setQuantityInputFieldsCheck] = useState(false);

  useEffect(() => {
    const GetRecipe = async () => {
      try {
        const result = await GetRecipeDetail(params.id);
        if (result) {
          setShow(result.recipeDetails);
          setDescription(result.recipeDetails.recipe_methods)
          customEditorRef.current.updateEditorValue()
          let currentQuantityInputFields = result.recipeDetails.recipe_ingredients.map(
            (data, index) => {
              return {
                quantity_no: ++index,
                ingredient: data.ingredient,
                quantity: data.quantity,
                unit: data.unit,
                check: false,
                validationMsg: null,
              };
            }
          );
          setQuantityInputFields([...currentQuantityInputFields]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (params.id) {
      GetRecipe();
    }
  }, []);

  const validateForm = () => {
    let valid = true;
    let showPhase = "";
    let showTitle = "";
    let showIng = "";
    let showSubType = "";
    let showMethod = "";
    if (show.phase_id === "none" || show.phase_id === "") {
      valid = false;
      showPhase = "Please select Phase";
    }
    if (show.recipe_type === "none" || show.recipe_type === "") {
      valid = false;
      showIng = "Please select Recipe Type";
    }
    if (show.recipe_type == 1 || show.recipe_type == 2) {
      if (show.recipe_sub_type === "none" || show.recipe_sub_type === "") {
        valid = false;
        showSubType = "Please select Recipe Sub Type";
      }
    }
    // if (show.recipe_methods === "") {
    //   valid = false;
    //   showMethod = "Please enter Recipe Methods";
    // }
    if (!customEditorRef.current.validateEditorValue()) {
      valid = false
      showMethod = "Please enter Recipe Methods";
    }
    if (show.recipe_title === "") {
      valid = false;
      showTitle = "Please enter Recipe Title";
    }
    if (show.serves_quantity === "") {
      valid = false;
      showTitle = "Please enter Quantity Served";
    }
    setError({
      ...error,
      recipe_title: { ...error.recipe_title, error: showTitle },
      serves_quantity: { ...error.serves_quantity, error: showTitle },
      recipe_methods: {
        ...error.recipe_methods,
        error: showMethod,
      },
      phase_id: { ...error.phase_id, error: showPhase },
      recipe_type: { ...error.recipe_type, error: showIng },
      recipe_sub_type: { ...error.recipe_sub_type, error: showSubType },
    });

    let currentQuantityInputFields = [...quantityInputFields];
    for (let quantityInputField of currentQuantityInputFields) {
      console.log(quantityInputField);
      if (quantityInputField.check) {
        valid = false;
        continue;
      } else if (
        (!quantityInputField.ingredient &&
          !quantityInputField.unit &&
          quantityInputField.quantity) ||
        (quantityInputField.ingredient == "" &&
          quantityInputField.quantity == 0 &&
          quantityInputField.unit == "none")
      ) {
        quantityInputField.check = true;
        quantityInputField.validationMsg = null;
        valid = false;
      } else if (
        !quantityInputField.ingredient ||
        quantityInputField.ingredient == ""
      ) {
        quantityInputField.check = true;
        quantityInputField.validationMsg = `Ingredient ${quantityInputField.quantity_no} name is required`;
        valid = false;
      } else if (
        !quantityInputField.quantity ||
        quantityInputField.quantity == 0
      ) {
        quantityInputField.check = true;
        quantityInputField.validationMsg = `Ingredient ${quantityInputField.quantity_no} quantity is required`;
        valid = false;
      } else if (
        !quantityInputField.unit ||
        quantityInputField.unit == "none"
      ) {
        quantityInputField.check = true;
        quantityInputField.validationMsg = `Ingredient ${quantityInputField.quantity_no} unit is required`;
        valid = false;
      }
    }
    setQuantityInputFields(currentQuantityInputFields);

    if (quantityInputFields.length < 1) {
      setQuantityInputFieldsCheck(true);
      valid = false;
    }

    return valid;
  };

  const showFile = async (event) => {
    event.preventDefault();

    if (event.target.files.length < 1) {
      return;
    }
    setError({
      ...error,
      recipe_image_url: { ...error.recipe_image_url, error: "" },
    });

    if (
      event.target.files[0].type !== "image/png" &&
      event.target.files[0].type !== "image/jpeg"
    ) {
      setError({
        ...error,
        recipe_image_url: {
          ...error.recipe_image_url,
          error: "Only jpeg, png images are allowed",
        },
      });
      return;
    }
    setImage(event.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setError({ ...error, recipe_title: { ...error.recipe_title, error: "" } });

    if (e.target.value === "") {
      setError({
        ...error,
        recipe_title: {
          ...error.recipe_title,
          error: "Please enter Recipe Title",
        },
      });
    }
    setShow({ ...show, recipe_title: e.target.value });
  };

  const handleServedChange = (e) => {
    setError({
      ...error,
      serves_quantity: { ...error.serves_quantity, error: "" },
    });

    if (e.target.value === "") {
      setError({
        ...error,
        serves_quantity: {
          ...error.serves_quantity,
          error: "Please Enter Quantity Served",
        },
      });
    }
    setShow({ ...show, serves_quantity: e.target.value });
  };

  // const handleMethodsChange = (e) => {
  //   setError({
  //     ...error,
  //     recipe_methods: { ...error.recipe_methods, error: "" },
  //   });

  //   if (e.target.value === "") {
  //     setError({
  //       ...error,
  //       recipe_methods: {
  //         ...error.recipe_methods,
  //         error: "Please enter a Description",
  //       },
  //     });
  //   }
  //   setShow({ ...show, recipe_methods: e.target.value });
  // };
  const handleTypeChange = (e) => {
    setRecipeType(e.target.value);
    setError({
      ...error,
      recipe_type: { ...error.recipe_type, error: "" },
    });

    if (e.target.value === "none") {
      setError({
        ...error,
        recipe_type: {
          ...error.recipe_type,
          error: "Please enter recipe type",
        },
      });
    }
    setShow({ ...show, recipe_type: e.target.value });
  };

  const handleSubTypeChange = (e) => {
    setError({
      ...error,
      recipe_sub_type: { ...error.recipe_sub_type, error: "" },
    });

    if (e.target.value === "none") {
      setError({
        ...error,
        recipe_sub_type: {
          ...error.recipe_sub_type,
          error: "Please enter recipe sub type",
        },
      });
    }
    setShow({ ...show, recipe_sub_type: e.target.value });
  };

  const handleCategoryIdChange = (e) => {
    setError({
      ...error,
      phase_id: { ...error.phase_id, error: "" },
    });

    if (e.target.value === "none") {
      setError({
        ...error,
        phase_id: {
          ...error.phase_id,
          error: "Please enter a Phase",
        },
      });
    }
    setShow({ ...show, phase_id: e.target.value });
  };

  let handleChangeQuantityFieldValue = (index, e, field) => {
    console.log(e.target.value, typeof e.target.value, isNaN(e.target.value));
    let currentQuantityInputFields = [...quantityInputFields];
    if (field == "ingredient") {
      if (!e.target.value) {
        currentQuantityInputFields[index].ingredient = e.target.value;
        currentQuantityInputFields[index].check = true;
        currentQuantityInputFields[
          index
        ].validationMsg = `Ingredient ${currentQuantityInputFields[index].quantity_no} name is required`;
      } else {
        currentQuantityInputFields[index].ingredient = e.target.value;
        currentQuantityInputFields[index].check = false;
        currentQuantityInputFields[index].validationMsg = null;
      }
    }
    if (field == "quantity") {
      if (!e.target.value) {
        currentQuantityInputFields[index].quantity = e.target.value;
        currentQuantityInputFields[index].check = true;
        currentQuantityInputFields[
          index
        ].validationMsg = `Ingredient ${currentQuantityInputFields[index].quantity_no} quantity is required`;
      } else {
        currentQuantityInputFields[index].quantity = e.target.value;
        currentQuantityInputFields[index].check = false;
        currentQuantityInputFields[index].validationMsg = null;
      }
    } else if (field == "unit") {
      currentQuantityInputFields[index].unit = e.target.value;
      currentQuantityInputFields[index].check = false;
      currentQuantityInputFields[index].validationMsg = null;
    }

    setQuantityInputFields(currentQuantityInputFields);
  };

  let handleAddQuantityField = () => {
    if (quantityInputFields.length >= 0) {
      setQuantityInputFieldsCheck(false);
    }

    let currentQuantityInputFields = [...quantityInputFields];
    currentQuantityInputFields.push({
      quantity_no: currentQuantityInputFields.length + 1,
      ingredient: "",
      quantity: null,
      unit: "none",
      check: false,
      validationMsg: null,
    });
    currentQuantityInputFields = currentQuantityInputFields.map(
      (currentQuantityInputField, key) => {
        return { ...currentQuantityInputField, quantity_no: ++key };
      }
    );
    setQuantityInputFields(currentQuantityInputFields);
  };

  let handleRemoveQuantityField = (index) => {
    if (quantityInputFields.length < 2) {
      setQuantityInputFieldsCheck(true);
    }
    let currentQuantityInputFields = [...quantityInputFields];
    currentQuantityInputFields.splice(index, 1);
    currentQuantityInputFields = currentQuantityInputFields.map(
      (currentQuantityInputField, key) => {
        return { ...currentQuantityInputField, quantity_no: ++key };
      }
    );
    setQuantityInputFields(currentQuantityInputFields);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    var body = {};
    console.log("image", image);
    if (image && image.type) {
      var data = new FormData();
      data.append("image", image, image.name);
      data.append("folderName", "recipe");

      try {
        setDisable(true);
        const result = await uploadImage(data);
        if (result) {
          setDisable(false);
          body.recipe_image_url = result.data.image_url;
          setShow({ ...show, recipe_image_url: result.data.image_url });
        }
      } catch (error) {
        console.log(error);
        setError({
          ...error,
          recipe_image_url: { ...error.recipe_image_url, error: error },
        });
      }
    } else if (params.id) {
      body.recipe_image_url = show.recipe_image_url;
    }

    if (params.id) {
      body.phase_id = Number(show.phase_id);
      body.recipe_type = Number(show.recipe_type);
      body.recipe_sub_type =
        show.recipe_type == 1 || show.recipe_type == 2
          ? Number(show.recipe_sub_type)
          : null;
      body.recipe_title = show.recipe_title;
      body.serves_quantity = Number(show.serves_quantity);
      // body.recipe_methods = show.recipe_methods;
      body.recipe_methods = description;
      body.recipe_ingredients = quantityInputFields.map(
        (quantityInputField) => {
          return {
            ingredient: quantityInputField.ingredient,
            quantity: quantityInputField.quantity,
            unit: quantityInputField.unit,
          };
        }
      );
      try {
        const response = await EditPost(params.id, body);
        setLoading(false);
        if (response) {
          history.push("/recipeManagement");
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      body.phase_id = Number(show.phase_id);
      body.recipe_sub_type = Number(show.recipe_sub_type);
      body.recipe_type = Number(show.recipe_type);
      body.recipe_title = show.recipe_title;
      body.serves_quantity = Number(show.serves_quantity);
      // body.recipe_methods = show.recipe_methods;
      body.recipe_methods = description;
      body.recipe_ingredients = quantityInputFields.map(
        (quantityInputField) => {
          return {
            ingredient: quantityInputField.ingredient,
            quantity: quantityInputField.quantity,
            unit: quantityInputField.unit,
          };
        }
      );

      try {
        const response = await SavePost(body);
        setLoading(false);
        if (response) {
          history.push("/recipeManagement");
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <CContainer
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {
          <CCol xl="10" md="10">
            <CCard>
              <CCardHeader style={{ fontFamily: "Lato" }}>
                <h3>
                  {params.id ? (
                    <strong>Edit Recipe</strong>
                  ) : (
                    <strong>Add Recipe</strong>
                  )}
                </h3>
              </CCardHeader>

              <CCardBody
                style={{
                  fontFamily: "Roboto",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="form-horizontal">
                  <div style={{ margin: "auto" }}>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel>
                          <h6>
                            <strong>Enter Recipe Title:</strong>
                          </h6>
                        </CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <CInput
                          type="text"
                          id="recipe_title"
                          name="recipe_title"
                          autoComplete="off"
                          value={show.recipe_title}
                          onChange={(e) => handleTitleChange(e)}
                          onBlur={handleTitleChange}
                        />
                        {error.recipe_title.error && (
                          <div className="email-validate">
                            {error.recipe_title.error}
                          </div>
                        )}
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="hf-recipe_image_url">
                          <h6>
                            <strong>Upload Recipe Image:</strong>
                          </h6>
                        </CLabel>
                      </CCol>
                      {show.recipe_image_url ? (
                        <CCol xs="12" md="9">
                          <label
                            className="block w-1/2 tracking-wide  mb-2 text-gray-300 h-50  w-1/2"
                            for="images"
                          >
                            <img
                              alt="Upload Image"
                              style={{
                                minHeight: "200px",
                                minWidth: "100%",
                                backgroundColor: "lightgray",
                                textAlign: "center",
                                height: "100px",
                                cursor: "pointer",
                              }}
                              src={show.recipe_image_url}
                              title={show.recipe_image_url}
                            />
                          </label>
                        </CCol>
                      ) : (
                        ""
                      )}
                      <div
                        style={
                          show.recipe_image_url
                            ? { paddingLeft: "200px" }
                            : { paddingLeft: "17px" }
                        }
                      >
                        <CInputFile
                          id="recipe_image_url"
                          name="recipe_image_url"
                          type="file"
                          onChange={(e) => {
                            const id = `recipe_image_url`;
                            showFile(e);
                          }}
                        />
                        {error.recipe_image_url.error && (
                          <div className="email-validate">
                            {error.recipe_image_url.error}
                          </div>
                        )}
                        <span style={{ color: "red", fontSize: "13px" }}>
                          {image.type || show.recipe_image_url
                            ? ""
                            : "*Recipe Image is required*"}
                        </span>
                      </div>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel
                          style={{ fontFamily: "Poppins" }}
                          htmlFor="textarea-input"
                        >
                          <h6>
                            <strong>Enter Recipe Ingredients:</strong>
                          </h6>
                        </CLabel>
                      </CCol>
                      <CCol xs="4" md="9">
                      {quantityInputFields.map((quantityInputField, index) => {
                        return (
                          <CCol xs="4" md="12">
                            <CInputGroup
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop:
                                  quantityInputField.quantity_no > 1
                                    ? "0.5rem"
                                    : "none",
                                marginLeft:
                                  quantityInputField.quantity_no > 1
                                    ? ""
                                    : "",
                              }}
                            >
                              <CInput
                                onChange={(e) =>
                                  handleChangeQuantityFieldValue(
                                    index,
                                    e,
                                    "ingredient"
                                  )
                                }
                                autoComplete="off"
                                value={quantityInputField.ingredient}
                                type="text"
                                id={`ingredient${quantityInputField.quantity_no}`}
                                name={`ingredient${quantityInputField.quantity_no}`}
                                placeholder="Ingredient name"
                              />
                              <CInput
                                onChange={(e) =>
                                  handleChangeQuantityFieldValue(
                                    index,
                                    e,
                                    "quantity"
                                  )
                                }
                                autoComplete="off"
                                value={quantityInputField.quantity}
                                type="number"
                                id={`quantity${quantityInputField.quantity_no}`}
                                name={`quantity${quantityInputField.quantity_no}`}
                                placeholder="Ingredient quantity"
                              />
                              <CInputGroupAppend
                                style={{
                                  display: "flex",
                                  justifyContent: "start",
                                  alignItems: "center",
                                }}
                              >
                                <div>
                                  <CSelect
                                    custom
                                    className="selectpicker"
                                    onChange={(e) =>
                                      handleChangeQuantityFieldValue(
                                        index,
                                        e,
                                        "unit"
                                      )
                                    }
                                    value={quantityInputField.unit}
                                    id={`unit${quantityInputField.quantity_no}`}
                                    name={`unit${quantityInputField.quantity_no}`}
                                    custom
                                    required
                                  >
                                    <option value="none" defaultValue>
                                      Select Unit
                                    </option>
                                    <optgroup label="Volume">
                                      {unitList
                                        .filter(
                                          (unit) => unit.label == "volume"
                                        )
                                        .map((unit) => {
                                          return (
                                            <option
                                              key={unit.id}
                                              value={unit.name}
                                            >
                                              {unit.name}
                                            </option>
                                          );
                                        })}
                                    </optgroup>
                                    <optgroup label="Weight">
                                      {unitList
                                        .filter(
                                          (unit) => unit.label == "weight"
                                        )
                                        .map((unit) => {
                                          return (
                                            <option
                                              key={unit.id}
                                              value={unit.name}
                                            >
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
                                            <option
                                              key={unit.id}
                                              value={unit.name}
                                            >
                                              {unit.name}
                                            </option>
                                          );
                                        })}
                                    </optgroup>
                                  </CSelect>
                                </div>
                                <div>
                                  <CBadge
                                    style={{
                                      marginLeft: "0.5rem",
                                      cursor: "pointer",
                                      display:
                                        quantityInputFields.length > 1
                                          ? ""
                                          : "none",
                                    }}
                                    color="danger"
                                    onClick={() =>
                                      handleRemoveQuantityField(index)
                                    }
                                  >
                                    <FaMinus />
                                  </CBadge>
                                </div>
                              </CInputGroupAppend>
                            </CInputGroup>
                            <div
                              style={{
                                color: "red",
                                marginLeft:
                                  quantityInputField.quantity_no > 1
                                    ? "11.5rem"
                                    : "",
                                display: quantityInputField.check ? "" : "none",
                              }}
                            >
                              {quantityInputField.validationMsg
                                ? quantityInputField.validationMsg
                                : `ingredient  ${quantityInputField.quantity_no} is required`}
                            </div>
                          </CCol>
                        );
                      })}
                      <CCol xs="12" md="12">
                        <CBadge
                          style={{
                            marginTop: "0.5rem",
                            marginLeft: "",
                            cursor: "pointer",
                          }}
                          color="secondary"
                          onClick={handleAddQuantityField}
                        >
                          <FaPlus />
                        </CBadge>
                      </CCol>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel
                          style={{ fontFamily: "Poppins" }}
                          htmlFor="textarea-input"
                        >
                          <h6>
                            <strong>Enter Recipe Methods:</strong>
                          </h6>
                        </CLabel>
                      </CCol>
                      <CCol xs="4" md="9">
                        {/* <CTextarea
                          type="text"
                          id="recipe_methods"
                          name="recipe_methods"
                          onBlur={handleMethodsChange}
                          value={show.recipe_methods}
                          onChange={handleMethodsChange}
                          rows="6"
                        /> */}
                        <CustomEditor
                          {...{
                            description,
                            setDescription,
                            descriptionCheck,
                            setDescriptionCheck,
                          }}
                          ref={customEditorRef}
                        />
                        {error.recipe_methods.error && (
                          <div className="email-validate">
                            {error.recipe_methods.error}
                          </div>
                        )}
                        {/* {descriptionCheck && (
                          <div className="email-validate">
                          Description is required
                          </div>
                        )} */}
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel>
                          <h6>
                            <strong>Quantity served:</strong>
                          </h6>
                        </CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <CInput
                          type="number"
                          min={0}
                          id="serves_quantity"
                          name="serves_quantity"
                          autoComplete="off"
                          value={show.serves_quantity}
                          onChange={handleServedChange}
                          onBlur={handleServedChange}
                        />
                        {error.serves_quantity.error && (
                          <div className="email-validate">
                            {error.serves_quantity.error}
                          </div>
                        )}
                      </CCol>
                    </CFormGroup>

                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="recipe_type">
                          <h6>
                            <strong>Recipe Type:</strong>
                          </h6>
                        </CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <CSelect
                          value={show.recipe_type}
                          onChange={handleTypeChange}
                          onBlur={handleTypeChange}
                          custom
                          name="recipe_type"
                          id="recipe_type"
                          options={type}
                        >
                          <option value="none">Select recipe type</option>
                          {type.map((item, index) => (
                            <option key={index} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </CSelect>
                        {error.recipe_type.error && (
                          <div className="email-validate">
                            {error.recipe_type.error}
                          </div>
                        )}
                      
                      
                      {show.recipe_type == 1 || show.recipe_type == 2 ? (
                        <CCol
                          xs="12"
                          md="12"
                          style={{ marginLeft: "", marginTop: "0.5rem" }}
                        >
                          <CSelect
                            value={show.recipe_sub_type}
                            onChange={handleSubTypeChange}
                            onBlur={handleSubTypeChange}
                            custom
                            name="recipe_sub_type"
                            id="recipe_sub_type"
                            options={
                              show.recipe_type
                                ? show.recipe_type == 1
                                  ? vegType
                                  : nonVegType
                                : recipeType == 1
                                ? vegType
                                : nonVegType
                            }
                          >
                            <option value="none">Select recipe sub type</option>
                            {(show.recipe_type
                              ? show.recipe_type == 1
                                ? vegType
                                : nonVegType
                              : recipeType == 1
                              ? vegType
                              : nonVegType
                            ).map((item, index) => (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </CSelect>
                          {error.recipe_sub_type.error && (
                            <div className="email-validate">
                              {error.recipe_sub_type.error}
                            </div>
                          )}
                        </CCol>
                      ) : (
                        ""
                      )}</CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="hf-category">
                          <h6>
                            <strong>Phase:</strong>
                          </h6>
                        </CLabel>
                      </CCol>
                      <CCol xs="12" md="9">
                        <CSelect
                          value={show.phase_id}
                          onChange={handleCategoryIdChange}
                          onBlur={handleCategoryIdChange}
                          custom
                          name="phase_id"
                          id="phase_id"
                          options={phase}
                        >
                          <option value="none">Select Phase</option>
                          {phase.map((item, index) => (
                            <option key={index} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </CSelect>
                        {error.phase_id.error && (
                          <div className="email-validate">
                            {error.phase_id.error}
                          </div>
                        )}
                      </CCol>
                    </CFormGroup>
                  </div>
                  <div style={{ textAlign: "-webkit-center" }}>
                    {loading ? (
                      <div
                        className="spinner-border text-success"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      <CButton
                        type="submit"
                        name="submit"
                        style={{
                          width: "75px",
                          backgroundColor: "teal",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        Save
                      </CButton>
                    )}
                    <CButton
                      style={{ width: "5rem", marginLeft: "2rem" }}
                      color="danger"
                      onClick={() => history.goBack()}
                    >
                      <strong>Cancel</strong>
                    </CButton>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        }
      </CContainer>
    </form>
  );
}
