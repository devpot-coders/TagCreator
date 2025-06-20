

import { useState } from 'react';
import AuthService from '../authService';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuthAction = async (action, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AuthService[action](...args);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      return result.data;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = (clientCode, username ,password) => handleAuthAction('login', clientCode, username, password);
  const signup = (userData) => handleAuthAction('signup', userData);
  const verifyEmail = (token) => handleAuthAction('verifyEmail', token);
  const sendOTP = (identifier) => handleAuthAction('sendOTP', identifier);
  const verifyOTP = (identifier, otp) => handleAuthAction('verifyOTP', identifier, otp);
  const forgotPassword = (email) => handleAuthAction('forgotPassword', email);
  const resetPassword = (token, newPassword) => handleAuthAction('resetPassword', token, newPassword);
  const logout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return {
    currentUser: AuthService.getCurrentUser(),
    isAuthenticated: AuthService.isAuthenticated(),
    loading,
    error,
    login,
    signup,
    verifyEmail,
    sendOTP,
    verifyOTP,
    forgotPassword,
    resetPassword,
    logout
  };
}