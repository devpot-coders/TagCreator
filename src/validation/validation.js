import * as yup from "yup";

export const LoginValidation = yup.object().shape({
  ClientCode: yup.string().required("Company code is required"),
  UserName: yup.string().required("Username is required"),
  Password: yup
    .string()
    .required("Password is required")
    // .min(8, "Password must be at least 8 characters long")
    // .matches(
    //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{8,}$/,
    //   "Password must contain uppercase, lowercase, number, and special"
    // ),
});