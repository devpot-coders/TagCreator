import { apiClient } from "../../auth/apiClient";
// import { getLocalStorage, setLocalStorage, removeLocalStorage } from './storageUtils';

const AuthService = {
  async fetchData(url) {
    try {
      const response = await apiClient.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Login with email/password
  async login(ClientCode, UserName, Password) {
    try {
      const response = await apiClient.post(
        "https://api.iconnectgroup.com/api/AuthToken/GetToken",
        { ClientCode, Password, UserName }
      );
      this.setAuthTokens(response.data);
      console.log(response.data, "login response");

      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Register new user
  async signup(userData) {
    try {
      const response = await apiClient.post("/auth/register", userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Verify email with token
  async verifyEmail(token) {
    try {
      const response = await apiClient.post("/auth/verify-email", { token });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Send OTP to email/phone
  async sendOTP(identifier) {
    try {
      const response = await apiClient.post("/auth/send-otp", { identifier });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Verify OTP
  async verifyOTP(identifier, otp) {
    try {
      const response = await apiClient.post("/auth/verify-otp", {
        identifier,
        otp,
      });
      this.setAuthTokens(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Password reset request
  async forgotPassword(email) {
    try {
      const response = await apiClient.post("/auth/forgot-password", { email });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      const response = await apiClient.post("/auth/reset-password", {
        token,
        newPassword,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Set auth tokens in storage
  setAuthTokens(data) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", data.user);
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  },

  // Get current user
  getCurrentUser() {
    return localStorage.getItem("user");
  },

  // Logout
  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },
};

export default AuthService;
