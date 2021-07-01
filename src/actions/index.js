import { SIGN_IN, SET_SIDEBAR } from "./types";
import history from "../history";
import { api } from "../api";

export const signIn = (formValues) => async (dispatch, getState) => {
  try {
    const response = await api.post("/api/v1/admin/login", {
      email: formValues.email,
      phone: formValues.phone,
      password: formValues.password,
    });

    await dispatch({
      type: SIGN_IN,
      payload: response.data,
    });

    if (getState().auth.isSignedIn) {
      history.push("/users");
    }
  } catch (error) {
    console.log(error);
  }
};

export const setSideBar = (value) => {
  return {
    type: SET_SIDEBAR,
    payload: value,
  };
};
