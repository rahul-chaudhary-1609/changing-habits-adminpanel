import { store } from "../store";
import axios from "axios";
import apiConstants from "../apiConstants";

export const api = axios.create({
  baseURL: apiConstants.baseURL,
});

export const getHeader = (config = {}) => {
  return {
    params: config.queryParams || null,
    headers: {
      Accept: config.header?.accept || "application/json",
      Authorization: store.getState().auth.isSignedIn,
      "Content-Type": config.header?.contentType || "application/json",
    },
  };
};

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
  let hoursMinutes = `${timeArray[0].split(":")[0]}:${
    timeArray[0].split(":")[1]
  }`;
  return `${dateArray[0]} ${dateArray[1]} ${dateArray[2]}, ${dateArray[3]} ${hoursMinutes} ${amPM}`;
};

export const checkLeapYear = (year) => {
  if ((0 == year % 4 && 0 != year % 100) || 0 == year % 400) {
    return true;
  } else {
    return false;
  }
};

export const unitList = [
  //volume
  { id: 1, name: "ml", label: "volume" },
  { id: 2, name: "litre", label: "volume" },
  { id: 3, name: "quart", label: "volume" },
  { id: 4, name: "pint", label: "volume" },
  { id: 5, name: "fl.oz.", label: "volume" },
  { id: 6, name: "cup(s)", label: "volume" },
  { id: 7, name: "tbsp", label: "volume" },
  { id: 8, name: "tsp", label: "volume" },

  //weight
  { id: 9, name: "LB", label: "weight" },
  { id: 10, name: "oz.", label: "weight" },
  { id: 11, name: "grams", label: "weight" },
  { id: 12, name: "KG", label: "weight" },

  //other
  { id: 13, name: "slices", label: "other" },
  { id: 14, name: "unit(s)", label: "other" },
];

export const phaseList = [
  {
    id: 1,
    name: "Kickstart",
    value: 1,
    label: "Kickstart",
  },
  {
    id: 2,
    name: "Phase 1",
    value: 2,
    label: "Phase 1",
  },
  {
    id: 3,
    name: "Phase 2",
    value: 3,
    label: "Phase 2",
  },
  {
    id: 4,
    name: "Phase 3",
    value: 4,
    label: "Phase 3",
  },
  {
    id: 5,
    name: "Phase 4",
    value: 5,
    label: "Phase 4",
  },
  {
    id: 6,
    name: "Phase 4 EVA",
    value: 6,
    label: "Phase 4 EVA",
  },
];

export const allQuestionTypes = [
  {
    option_no: 1,
    option_value: "Single-Select",
    isRequired: false,
    check: false,
  },
  {
    option_no: 2,
    option_value: "Multi-Select",
    isRequired: false,
    check: false,
  },
  {
    option_no: 3,
    option_value: "Input-Box",
    isRequired: false,
    check: false,
  },
];

export const listCategories = [
  {
    option_no: 1,
    option_value: "Profile Quiz",
    isRequired: false,
    check: false,
  },
  {
    option_no: 2,
    option_value: "Eating Habits Quiz",
    isRequired: false,
    check: false,
  },
  { option_no: 3, option_value: "Other", isRequired: false, check: false },
];
