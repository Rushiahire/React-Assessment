import * as Yup from "yup";

export const registerValidation = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),

  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),

  contact: Yup.string()
    .optional()
    .matches(/^\d{10}$/, "Contact Number must be exactly 10 digits"),

  password: Yup.string()
    .required("Password is required")
    .min(4, "Password must be at least 4 characters"),
});
