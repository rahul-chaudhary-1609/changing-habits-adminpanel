import { store } from "../store";

export const apiError = (error) => {
  console.log(error);
  if (error?.response?.status === 401) {
    localStorage.clear();
    store.dispatch({ type: "USER_LOGOUT" });
  } else if (error?.request) {
    console.log(error);
  }
  console.log(error);
};

export const header = (roleId = 1, contentType, accept) => {
  const token = sessionStorage.getItem("jwt")
    ? sessionStorage.getItem("jwt")
    : store.getState().auth.isSignedIn;

  return {
    Authorization: `Bearer ${token}`,
    roleId: roleId,
  };
};
