import React from "react";

export const Loader = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '300px',
    width: '100%',
  }}>
    <div className="loader-spin" style={{
      border: '6px solid #f3f3f3',
      borderTop: '6px solid #d97706', // orange-600
      borderRadius: '50%',
      width: '48px',
      height: '48px',
      animation: 'spin 1s linear infinite'
    }} />
    <div style={{ marginTop: 16, color: '#d97706', fontWeight: 600 }}>Loading...</div>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}
    </style>
  </div>
);
