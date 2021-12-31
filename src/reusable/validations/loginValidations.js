import * as yup from "yup";

export const loginValidation = () => {
  return yup.object({
    email_phone: yup
      .string()
      .required("Email or Phone is required")
      .trim()
      .nullable(),
    password: yup
      .string()
      .test(
        "regex",
        "Password must be min 6 characters and max 15 characters, and have 1 Special Character, 1 Uppercase, 1 Number and 1 Lowercase",
        (val) => {
          let regExp = new RegExp(
            "^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,15}$"
          );

          return regExp.test(val);
        }
      ),
  });
};

export const newpasswordValidation = () => {
  return yup.object({
    password: yup
      .string()
      .test(
        "regex",
        "Password must be min 6 characters and max 15 characters, and have 1 Special Character, 1 Uppercase, 1 Number and 1 Lowercase",
        (val) => {
          let regExp = new RegExp(
            "^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,15}$"
          );

          return regExp.test(val);
        }
      ),

    confirmpassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .trim(),
  });
};

export const forgetpasswordValidation = () => {
  return yup.object({
    email: yup
      .string()
      .email("Invalid Email address format")
      .required("Email address is required")
      .trim(),
  });
};

export const ChangePasswordValidation = () => {
  return yup.object({
    oldpassword: yup
      .string()
      .required("Old Password is required")
      .test(
        "regex",
        "Password must be min 6 characters and max 15 characters, and have 1 Special Character, 1 Uppercase, 1 Number and 1 Lowercase",
        (val) => {
          let regExp = new RegExp(
            "^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,15}$"
          );

          return regExp.test(val);
        }
      ),
    newpassword: yup
      .string()
      .required("New Password is required")
      .test(
        "regex",
        "Password must be min 6 characters and max 15 characters, and have 1 Special Character, 1 Uppercase, 1 Number and 1 Lowercase",
        (val) => {
          let regExp = new RegExp(
            "^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,15}$"
          );

          return regExp.test(val);
        }
      ),
    confirmpassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("newpassword"), null], "Passwords must match")
      .trim(),
  });
};

export const OTPvalidation = () => {
  return yup.object({
    otp: yup
      .string()
      .required("OTP is required")
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(4, "Must be exactly 4 digits")
      .max(4, "Must be exactly 4 digits"),
  });
};

export const updateEmail = () => {
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  return yup.object({
    name: yup
      .string()
      .test(
        "alphabetsonly",
        "Admin name should not contain Numbers and Special characters",
        function (val) {
          return /^[a-zA-Z\s]*$/.test(val);
        }
      )
      .required("Name is Required"),
    newemail: yup
      .string()
      .email("Invalid Email address format")
      .required("Email address is required")
      .trim(),
    newPhone: yup.string().matches(phoneRegExp, "Phone number is not valid"),
  });
};

export const UserValidation = (subscriptionStatus) => {
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  return yup.object({
    name: yup
      .string()
      .test(
        "alphabetsonly",
        "Name should not contain Numbers and Special characters",
        function (val) {
          return /^[a-zA-Z\s]*$/.test(val);
        }
      )
      .required("Name is Required"),
    email: yup
      .string()
      .email("Invalid Email address format")
      .required("Email address is required")
      .trim(),
    phone_no: yup
      .string()
      .matches(phoneRegExp, "Phone Number is not valid")
      .required("Phone Number is required")
      .max(10, "Phone Number cannot exceed 10 characters"),
    subscription_token_id: subscriptionStatus
      ? yup.string().required("Token Id is required")
      : "",
  });
};

export const ChangeUserPasswordValidation = () => {
  return yup.object({
    newpassword: yup
      .string()
      .required("New Password is required")
      .test(
        "regex",
        "Password must have minimum 6 and maximum 15 characters",
        (val) => {
          let regExp = new RegExp("^.{6,15}$");

          return regExp.test(val);
        }
      ),
    confirmpassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("newpassword"), null], "Passwords must match")
      .trim(),
  });
};
