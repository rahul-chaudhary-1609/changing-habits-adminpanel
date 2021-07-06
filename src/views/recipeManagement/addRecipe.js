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

  const [recipeType, setRecipeType] = useState(null);
  const [disable, setDisable] = useState(false);
  const [image, setImage] = useState({});

  const [show, setShow] = useState({
    phase_id: "",
    recipe_image_url: "",
    recipe_title: "",
    recipe_ingredients: "",
    recipe_methods: "",
  });

  const [error, setError] = useState({
    phase_id: {
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
          setRecipeType(result.recipeDetails.recipe_type);
          setShow(result.recipeDetails);
        }
      } catch (error) {
        console.log(error);
      }
    };

    GetRecipe();
  }, [params.id]);

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
    setError({
      ...error,
      recipe_title: { ...error.recipe_title, error: showTitle },
      recipe_ingredients: {
        ...error.recipe_ingredients,
        error: showIng,
      },
      recipe_methods: {
        ...error.recipe_methods,
        error: showMethod,
      },
      phase_id: { ...error.phase_id, error: showPhase },
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
    } else body.recipe_image_url = show.recipe_image_url;

    if (params.id) {
      body.phase_id = Number(show.phase_id);
      body.recipe_title = show.recipe_title;
      body.recipe_ingredients = show.recipe_ingredients;
      body.recipe_methods = show.recipe_methods;
      body.recipe_type = recipeType ? recipeType : show.recipe_type;
      try {
        setLoading(true);
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
      body.recipe_title = show.recipe_title;
      body.recipe_ingredients = show.recipe_ingredients;
      body.recipe_methods = show.recipe_methods;
      body.recipe_type = recipeType ? recipeType : show.recipe_type;

      try {
        setLoading(true);
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

  const handleRecipeType = (type) => {
    setRecipeType(type);
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
                  {location.state ? (
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
                        <CLabel htmlFor="recipe_type">
                          <h6>Recipe type?</h6>
                        </CLabel>
                      </CCol>
                      <CCol row md="3">
                        <label for={1}>
                          <CInput
                            type="radio"
                            id={1}
                            formControlName="recipe_type"
                            checked={recipeType == 1 ? "checked" : ""}
                            style={{
                              width: "60%",
                              marginTop: "-7px",
                              outline: "none !important",
                            }}
                            onChange={() => {
                              handleRecipeType(1);
                            }}
                          />
                          Veg
                        </label>
                      </CCol>
                      <CCol row md="3">
                        <label for={2}>
                          <CInput
                            type="radio"
                            id={2}
                            formControlName="recipe_type"
                            checked={recipeType == 2 ? "checked" : ""}
                            value={show.recipe_type}
                            style={{ width: "28%", marginTop: "-7px" }}
                            onChange={() => {
                              handleRecipeType(2);
                            }}
                          />
                          Non Veg
                        </label>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md="3">
                        <CLabel htmlFor="hf-category">
                          <h6>
                            <strong>Phase</strong>
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
                        {/* {formik.touched.categoryTypeId && formik.errors.categoryTypeId ? <div className="email-validate">{formik.errors.categoryTypeId}</div> : null} */}
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
                        // disabled={disable}
                        type="submit"
                        name="submit"
                        color="success"
                        style={{ width: "75px" }}
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
