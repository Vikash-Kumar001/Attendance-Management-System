import React, { useState } from 'react';
import authService from '../services/authService';
import { useHistory } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.sendVerificationCode({ email });
      setMessage(response.data.message);
      setLoading(false);
      setTimeout(() => {
        // Redirect to reset password page after a successful code sent
        history.push('/reset-password');
      }, 2000); // Delay before redirecting
    } catch (error) {
      setLoading(false);
      setError('Error sending verification code');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <p>Enter your email to receive a password reset verification code.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Verification Code'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default ForgotPasswordPage;
