import { OTPVerification } from "./exampleOTPVerification.usage";


function VerificationPage() {
  const email = 'user@example.com'; // This would typically come from your state or route
  
  const handleVerificationSuccess = (userData) => {
    // Handle successful verification
    console.log('User verified:', userData);
    // Redirect to dashboard or other page
  };

  return (
    <div className="page-container">
      <OTPVerification 
        identifier={email}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </div>
  );
}