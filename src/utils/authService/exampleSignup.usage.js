import { useState } from "react";
import { useAuth } from "./authHooks/useAuth";

export function SignupForm() {
    const { signup, loading, error } = useAuth();
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match");
        return;
      }
      await signup(formData);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <div className="error">{error}</div>}
        
        <div>
          <label>Full Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
        
        <div>
          <a href="/login">Already have an account? Login</a>
        </div>
      </form>
    );
  }