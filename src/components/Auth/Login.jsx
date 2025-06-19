import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import React, { useEffect, useState } from "react";
import loginImage from "../../assets/login.png";
import { LoginValidation } from "../../validation/validation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../utils/authService/authHooks/useAuth";
import axios from "axios";

const Login = () => {

  const { login, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    ClientCode: "",
    UserName: "",
    Password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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
    try {
      setErrors({});
      await LoginValidation.validate(formData, { abortEarly: false });

      await login(formData.ClientCode, formData.UserName, formData.Password);
      
    } catch (err) {
      if (err.name === "ValidationError") {
        const formattedErrors = {};
        err.inner.forEach((e) => {
          formattedErrors[e.path] = e.message;
        });
        setErrors(formattedErrors);
      } else {
        console.error("Unexpected error:", err);
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
          {/* Company Code */}
          <div className="mb-4 xl:h-[55px]">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <Label
                className="sm:w-32 w-full text-gray-700 font-semibold sm:mb-0"
                htmlFor="ClientCode"
              >
                Company Code
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
              <div className="flex-1 xl:h-[60px]  mt-2 xl:mt-0">
                <Input
                  id="Password"
                  name="Password"
                  type={showPassword ? "text" : "Password"}
                  value={formData.Password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <p className="text-red-500 text-xs mt-1 min-h-[18px]">
                  {errors.Password || "\u00A0"}
                </p>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-14 xl:top-[211px] h-0 flex items-center text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <div className="xl:flex xl:justify-end flex flex-col sm:flex-row items-center xl:mt-6">
            <Button
              type="submit"
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 xl:px-6 px-8 rounded shadow mb-4 sm:mb-0 sm:mr-4 transition duration-200"
            >
              Login
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
