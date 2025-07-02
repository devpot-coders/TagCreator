import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import React, { useEffect, useState } from "react";
import loginImage from "../../assets/login.png";
import { LoginValidation } from "../../validation/validation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../utils/authService/authHooks/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const Login = () => {
  const navigate = useNavigate();

  const { login, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    ClientCode: "",
    UserName: "",
    Password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Prefill from localStorage if available
  useEffect(() => {
    const savedCompanyCode = localStorage.getItem('company_code') || '';
    const savedUsername = localStorage.getItem('username') || '';
    const savedPassword = localStorage.getItem('password') || '';
    setFormData({
      ClientCode: savedCompanyCode,
      UserName: savedUsername,
      Password: savedPassword,
    });
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    try {
      await LoginValidation.validateAt(name, { ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (validationError) {
      setErrors((prev) => ({
        ...prev,
        [name]: validationError.message,
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});


    try {
      await LoginValidation.validate(formData, { abortEarly: false });

      const result = await login(
        formData.ClientCode,
        formData.UserName,
        formData.Password
      );

      console.log("login result:", result);

      if (result.success === true) {
        // Save credentials to localStorage
        localStorage.setItem('company_code', formData.ClientCode);
        localStorage.setItem('username', formData.UserName);
        localStorage.setItem('password', formData.Password);
        navigate("/");
      } else {
        setErrors({ general: result.error || "Login failed" });
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const errs = {};
        err.inner.forEach((e) => {
          errs[e.path] = e.message;
        });
        setErrors(errs);
      } else {
        console.error("Unexpected error:", err);
        setErrors({ general: "Something went wrong. Please try again." });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="relative flex flex-col md:flex-row bg-white border rounded-lg shadow-xl p-1 md:p-12 max-w-2xl w-full">
        {/* Logo Section */}
        <div className="md:absolute md:bottom-8 md:left-8 flex justify-center md:justify-start items-end md:items-end mb-6 md:mb-0">
          <div className="w-24 h-24 md:w-40 md:h-40 flex items-center justify-center rounded-lg overflow-hidden">
            <img
              src={loginImage}
              alt=""
              className="object-contain w-20 h-20 md:w-40 md:h-36"
            />
          </div>
        </div>
        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center w-full max-w-sm md:ml-48"
        >
          {/* General error message */}
          {errors.general && (
            <div className="mb-4 text-center text-red-600 font-semibold bg-red-50 border border-red-200 rounded p-2">
              {errors.general === "Request failed with status code 500" || errors.general?.status === 500
                ? "Invalid username or password. Please try again."
                : errors.general}
            </div>
          )}
          {/* Company Code */}
          <div className="mb-4 xl:h-[55px]">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <Label
                className="sm:w-32 w-full text-gray-700 font-semibold sm:mb-0"
                htmlFor="ClientCode"
              >
                Client Code
              </Label>
              <div className="flex-1 mt-2 xl:mt-0">
                <Input
                  id="ClientCode"
                  name="ClientCode"
                  type="text"
                  value={formData.ClientCode}
                  onChange={handleChange}
                  placeholder="ClientCode"
                />
                <p className="text-red-500 text-xs mt-1 min-h-[18px]">
                  {errors.ClientCode || "\u00A0"}
                </p>
              </div>
            </div>
          </div>
          {/* UserName */}
          <div className="mb-4 xl:h-[55px]">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <Label
                className="sm:w-32 w-full text-gray-700 font-semibold sm:mb-0"
                htmlFor="UserName"
              >
                UserName
              </Label>
              <div className="flex-1 mt-2 xl:mt-0">
                <Input
                  id="UserName"
                  name="UserName"
                  type="text"
                  value={formData.UserName}
                  onChange={handleChange}
                  placeholder="UserName"
                />
                <p className="text-red-500 text-xs mt-1 min-h-[18px]">
                  {errors.UserName || "\u00A0"}
                </p>
              </div>
            </div>
          </div>
          {/* Password */}
          <div className="">
            <div className="flex flex-col xl:h-[60px] sm:flex-row sm:items-center">
              <Label
                className="sm:w-32 w-full text-gray-700 font-semibold sm:mb-0"
                htmlFor="Password"
              >
                Password
              </Label>
              <div className="flex-1 xl:h-[60px] mt-2 xl:mt-0 relative">
                <Input
                  id="Password"
                  name="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.Password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <p className="text-red-500 text-xs mt-1 min-h-[18px]">
                  {errors.Password || "\u00A0"}
                </p>
              </div>
            </div>
          </div>

          <div className="xl:flex xl:justify-end flex flex-col sm:flex-row items-center xl:mt-6">
            <Button
              type="submit"
              disabled={loading}
              className="relative flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-8 rounded shadow transition duration-200 w-full sm:w-auto"
            >
              <span className={loading ? "invisible" : ""}>Login</span>

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CircularProgress size={20} color="inherit" />
                </div>
              )}
            </Button>

            <Button
              type="button"
              className="w-full sm:w-auto bg-gray-100 text-gray-500 font-semibold py-2 xl:px-2 px-4 rounded cursor-not-allowed"
              disabled
            >
              Forgot Password?
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
