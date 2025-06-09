import { useEffect, useState } from "react";
import { useAuth } from "./authHooks/useAuth";

export function OTPVerification({ identifier, onVerificationSuccess }) {
    const { verifyOTP, loading, error, sendOTP } = useAuth();
    const [otp, setOtp] = useState('');
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);
  
    useEffect(() => {
      if (resendDisabled) {
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setResendDisabled(false);
              return 30;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      }
    }, [resendDisabled]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const result = await verifyOTP(identifier, otp);
      if (result) onVerificationSuccess(result);
    };
  
    const handleResendOTP = async () => {
      setResendDisabled(true);
      setCountdown(30);
      await sendOTP(identifier);
    };
  
    const handleOtpChange = (e) => {
      const value = e.target.value.replace(/[^0-9]/g, '');
      setOtp(value);
    };
  
    return (
      <div className="otp-container">
        <h2>OTP Verification</h2>
        <p>Enter the 6-digit code sent to {identifier}</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
  
        <form onSubmit={handleSubmit}>
          <div className="otp-input-group">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter 6-digit OTP"
              autoComplete="one-time-code"
              disabled={loading}
              className="otp-input"
            />
          </div>
  
          <button 
            type="submit" 
            disabled={loading || otp.length !== 6}
            className="verify-button"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
  
        <div className="resend-section">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendDisabled || loading}
            className="resend-button"
          >
            {resendDisabled ? `Resend in ${countdown}s` : 'Resend OTP'}
          </button>
        </div>
      </div>
    );
  }