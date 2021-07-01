import axios from "axios";
import apiConstant from "src/apiConstants";
import { apiError, header } from "./utils/helper";
import { store } from "./store";

export const api = axios.create({
  baseURL: `http://54.158.24.113/changinghabits`,
});

export const api2 = "http://54.158.24.113/changinghabits";

export const SavePost = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`${apiConstant.AddRecipe}`, body, {
        headers: header(),
      });

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const EditPost = (recipe_id, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(
        `${apiConstant.EditRecipe}/${recipe_id}`,
        body,
        {
          headers: header(),
        }
      );

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const GetUserProfile = () => {
  return new Promise(async (resolve, reject) => {
    // console.log(id, token);

    try {
      const response = await api.get(`${apiConstant.GetUserProfile}`, {
        headers: header(),
      });

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const UpdateEmailOrPhone = (userId, email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(
        `${apiConstant.UpdateEmailOrPhone}`,
        {
          userId: userId,
          emailOrPhoneNumber: email,
        },
        {
          headers: header(),
        }
      );

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const UpdateProfile = (bodyFormData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(
        `${apiConstant.UpdateProfile}`,
        JSON.stringify(bodyFormData),
        {
          headers: {
            Accept: "application/json",
            Authorization: store.getState().auth.isSignedIn,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const forgetpasswordApi = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`${apiConstant.ForgotPassword}`, {
        email: email,
      });

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
      reject("An account with given info does not exist");
    }
  });
};

export const verifyOTP = (email, otp) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`${apiConstant.VerifyOtp}`, {
        emailOrPhoneNumber: email,
        otp: otp,
      });

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const resetPassword = (email, password, confirmPassword, otp) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`${apiConstant.ResetPassword}`, {
        password: password,
        confirmPassword: confirmPassword,
        emailOrPhoneNumber: email,
        otp: otp,
      });

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const ChangePasswordApi = (oldPassword, newPassword, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`${apiConstant.ChangePassword}`, {
        userId: id,
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const signIn = (formValues) => {
  let data = {};
  if (formValues.email) data.email = formValues.email;
  if (formValues.phone) data.phone = formValues.phone;
  data.password = formValues.password;
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`${apiConstant.Login}`, data);

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data.message);
      }
    } catch (error) {
      apiError(error);
      reject("Invalid Credentials Entered!!");
    }
  });
};

export const addUserList = (data) => {
  let formData = {
    name: data.name,
    email: data.email,
    country_code: data.country_code,
    phone_no: data.phone_no,
  };
  const token = store.getState().auth.isSignedIn;

  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(
        `${apiConstant.AddUser}`,
        JSON.stringify(formData),
        {
          headers: {
            Accept: "application/json",
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const ViewUserDetails = (user_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(
        `${apiConstant.ViewUserDetails}/${user_id}`,
        {
          headers: header(),
        }
      );

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const GetUserList = (page, search) => {
  let searchKey;
  if (search) {
    searchKey = `searchKey=${search}`;
  } else {
    searchKey = "";
  }
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(
        apiConstant.GetUserList.concat(`${page}&page_size=10&${searchKey}`),
        {
          headers: header(),
        }
      );

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const ChangeUserStatus = (id, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(
        `${apiConstant.ChangeUserStatus}/${id}`,
        {
          status: status,
        },
        {
          headers: header(),
        }
      );

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const EditUserDetails = (data, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(
        `${apiConstant.EditUserDetails}/${id}`,
        JSON.stringify(data),
        {
          headers: {
            Accept: "application/json",
            Authorization: store.getState().auth.isSignedIn,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const uploadImage = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(`${apiConstant.uploadImage}`, data, {
        headers: {
          Authorization: store.getState().auth.isSignedIn,
          "Content-Type": "multipart/form-data",
        },
      });
      // .then((response) => response);

      if (response.status == 200) {
        resolve(response);
      } else {
        reject(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

export const GetRecipeList = (page, search) => {
  let searchKey;
  if (search) {
    searchKey = `searchKey=${search}`;
  } else {
    searchKey = "";
  }
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(
        apiConstant.GetRecipesList.concat(`${page}&page_size=10&${searchKey}`),
        {
          headers: header(),
        }
      );

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const DeleteRecipe = (recipe_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.delete(
        `${apiConstant.DeleteRecipe}/${recipe_id}`,
        {
          headers: {
            Authorization: store.getState().auth.isSignedIn,
            "Content-Type": "application/x-www-form-urlencoded",
            accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const GetRecipeDetail = (recipe_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(
        `${apiConstant.GetRecipeDetail}/${recipe_id}`,
        {
          headers: header(),
        }
      );

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const addFaq = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`${apiConstant.addFaq}`, body, {
        headers: header(),
      });

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const DeleteFaq = (faq_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.delete(`${apiConstant.DeleteFaq}/${faq_id}`, {
        headers: {
          Authorization: store.getState().auth.isSignedIn,
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
      });

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const editFaqs = (faq_id, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(
        `${apiConstant.EditFaqs}/${faq_id}`,
        body,
        {
          headers: {
            Authorization: store.getState().auth.isSignedIn,
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const getFaqById = (faq_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`${apiConstant.GetFaqById}/${faq_id}`, {
        headers: header(),
      });

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const getFaqs = (page) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(
        apiConstant.GetFaqs.concat(`?page=${page}&page_size=10`),
        {
          headers: header(),
        }
      );

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const getFileContent = (url) => {
  const token = store.getState().auth.isSignedIn;
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(
        `/api/v1/admin/htmlFileToText?file_url=${url}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: token,
          },
        }
      );
      // .then((response) => response.text());

      if (response.status == 200) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const getStaticContentDetails = (content_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(
        `${apiConstant.GetContentDetails}/${content_id}`,
        {
          headers: header(),
        }
      );

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const getStaticContents = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(apiConstant.GetStaticContentList, {
        headers: header(),
      });

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const updateStaticContent = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(
        `${apiConstant.updateStaticContent}`,
        JSON.stringify(body),
        {
          headers: {
            Accept: "application/json",
            Authorization: store.getState().auth.isSignedIn,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};

export const ToggleFaqStatus = (faq_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = fetch(
        `${api2}/${apiConstant.ToggleFaqStatus}/${faq_id}`,
        {
          headers: header(),
          method: "PUT",
        }
      );

      if (response.data.success) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      apiError(error);
    }
  });
};
