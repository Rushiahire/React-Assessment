import * as Yup from "yup";

export const loginValidation = Yup.object({
  identifier: Yup.string()
    .required("Username or Email is required"),
  password: Yup.string()
    .required("Password is required"),
});
