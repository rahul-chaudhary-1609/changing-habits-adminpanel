import React, { useState, useEffect } from "react";
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
} from "@coreui/react";

import { uploadImage, SavePost, EditPost, GetRecipeDetail } from "../../api";
import { useLocation, useHistory, useParams } from "react-router-dom";
import FormData from "form-data";

export default function AddRecipe() {
  const location = useLocation();
  const history = useHistory();
  const params = useParams();

  var phase = [
    {
      label: "kisckstart",
      value: 1,
    },
    {
      label: "phase 1",
      value: 2,
    },

    {
      label: "phase 2",
      value: 3,
    },
    {
      label: "phase 3",
      value: 4,
    },
    {
      label: "phase 4",
      value: 5,
    },
    {
      label: "phase 4 eva",
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

  const [show, setShow] = useState({
    recipe_sub_type: "",
    recipe_type: "",
    phase_id: "",
    recipe_image_url: "",
    serves_quantity: null,
    recipe_title: "",
    recipe_ingredients: "",
    recipe_methods: "",
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
    recipe_ingredients: {
      error: "",
      blur: "",
    },
    recipe_methods: {
      error: "",
      blur: "",
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const GetRecipe = async () => {
      try {
        const result = await GetRecipeDetail(params.id);
        if (result) {
          setShow(result.recipeDetails);
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
    let showMethod = "";
    if (show.phase_id === "none" || show.phase_id === "") {
      valid = false;
      showPhase = "Please select Phase";
    }
    if (show.recipe_type === "none" || show.recipe_type === "") {
      valid = false;
      showPhase = "Please select Recipe Type";
    }
    if (show.recipe_sub_type === "none" || show.recipe_sub_type === "") {
      valid = false;
      showPhase = "Please select Recipe Sub Type";
    }
    if (show.recipe_ingredients === "") {
      valid = false;
      showIng = "Please enter Recipe Ingredients";
    }
    if (show.recipe_methods === "") {
      valid = false;
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
      recipe_ingredients: {
        ...error.recipe_ingredients,
        error: showIng,
      },
      recipe_methods: {
        ...error.recipe_methods,
        error: showMethod,
      },
      phase_id: { ...error.phase_id, error: showPhase },
      recipe_type: { ...error.recipe_type, error: showPhase },
      recipe_sub_type: { ...error.recipe_sub_type, error: showPhase },
    });

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

  const handleDescriptionChange = (e) => {
    setError({
      ...error,
      recipe_ingredients: { ...error.recipe_ingredients, error: "" },
    });

    if (e.target.value === "") {
      setError({
        ...error,
        recipe_ingredients: {
          ...error.recipe_ingredients,
          error: "Please enter Recipe Ingredients",
        },
      });
    }
    setShow({ ...show, recipe_ingredients: e.target.value });
  };

  const handleMethodsChange = (e) => {
    setError({
      ...error,
      recipe_methods: { ...error.recipe_methods, error: "" },
    });

    if (e.target.value === "") {
      setError({
        ...error,
        recipe_methods: {
          ...error.recipe_methods,
          error: "Please enter a Description",
        },
      });
    }
    setShow({ ...show, recipe_methods: e.target.value });
  };
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
      body.recipe_sub_type = Number(show.recipe_sub_type);
      body.recipe_title = show.recipe_title;
      body.serves_quantity = Number(show.serves_quantity);
      body.recipe_ingredients = show.recipe_ingredients;
      body.recipe_methods = show.recipe_methods;
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
      body.recipe_ingredients = show.recipe_ingredients;
      body.recipe_methods = show.recipe_methods;

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
                        <CTextarea
                          type="text"
                          id="recipe_ingredients"
                          name="recipe_ingredients"
                          onBlur={handleDescriptionChange}
                          value={show.recipe_ingredients}
                          onChange={handleDescriptionChange}
                          rows="6"
                        />
                        {error.recipe_ingredients.error && (
                          <div className="email-validate">
                            {error.recipe_ingredients.error}
                          </div>
                        )}
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
                        <CTextarea
                          type="text"
                          id="recipe_methods"
                          name="recipe_methods"
                          onBlur={handleMethodsChange}
                          value={show.recipe_methods}
                          onChange={handleMethodsChange}
                          rows="6"
                        />
                        {error.recipe_methods.error && (
                          <div className="email-validate">
                            {error.recipe_methods.error}
                          </div>
                        )}
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
                          <option value="none">Select recipe type:</option>
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
                      </CCol>
                      {show.recipe_type == 1 || show.recipe_type == 2 ? (
                        <CCol
                          xs="12"
                          md="9"
                          style={{ marginLeft: "11.5rem", marginTop: "0.5rem" }}
                        >
                          <CSelect
                            value={show.recipe_sub_type}
                            onChange={handleSubTypeChange}
                            onBlur={handleSubTypeChange}
                            custom
                            name="recipe_sub_type"
                            id="recipe_sub_type"
                            options={recipeType == 1 ? vegType : nonVegType}
                          >
                            <option value="none">Select recipe sub type</option>
                            {(recipeType == 1 ? vegType : nonVegType).map(
                              (item, index) => (
                                <option key={index} value={item.value}>
                                  {item.label}
                                </option>
                              )
                            )}
                          </CSelect>
                          {error.recipe_sub_type.error && (
                            <div className="email-validate">
                              {error.recipe_sub_type.error}
                            </div>
                          )}
                        </CCol>
                      ) : (
                        ""
                      )}
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
