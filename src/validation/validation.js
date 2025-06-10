import * as yup from "yup";

export const LoginValidation = yup.object().shape({
  companyCode: yup.string().required("Company code is required"),
  userName: yup.string().required("Username is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{8,}$/,
      "Password must contain uppercase, lowercase, number, and special"
    ),
});