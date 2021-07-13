import { store } from "../store";
import axios from "axios";
import apiConstants from "../apiConstants";

export const api = axios.create({
  baseURL: apiConstants.baseURL,
});

export const getHeader = (config = {}) => {
  return {
    params:config.queryParams ||null,
    headers: {
      Accept: config.header?.accept || "application/json",
      Authorization: store.getState().auth.isSignedIn,
      "Content-Type": config.header?.contentType || "application/json",
    },
  }
}

export const apiError = (error) => {
  console.log(error);
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    localStorage.clear();
    store.dispatch({ type: "USER_LOGOUT" });
  } else if (error?.request) {
    console.log(error);
  }
  console.log(error);
};

export const header = (roleId = 1, contentType, accept) => {
  const token = store.getState().auth.isSignedIn;

  return {
    Authorization: `Bearer ${token}`,
    roleId: roleId,
  };
};

export const getFormatedDateTime = (dateTime) => {
  let dateArray = new Date(dateTime).toString().split(" ");
  let timeArray = new Date(dateTime).toLocaleTimeString().split(" ");
  let amPM = timeArray[1];
  let hoursMinutes=`${timeArray[0].split(":")[0]}:${timeArray[0].split(":")[1]}`;
  return `${dateArray[0]} ${dateArray[1]}, ${dateArray[2]} ${dateArray[3]} ${hoursMinutes} ${amPM}`
}
