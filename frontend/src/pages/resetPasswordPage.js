import React, { useState } from 'react';
import authService from '../services/authService';
import { useHistory } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangeCode = (e) => {
    setCode(e.target.value);
  };

  const handleChangePassword = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.resetPassword({
        email,
        code,
        newPassword,
      });
      setMessage(response.data.message);
      setLoading(false);
      setTimeout(() => {
        // Redirect to login page after password reset
        history.push('/login');
      }, 2000); // Delay before redirecting
    } catch (error) {
      setLoading(false);
      setError('Error resetting password');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <p>Enter the verification code and your new password.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={handleChangeEmail}
        />
        <input
          type="text"
          placeholder="Verification Code"
          value={code}
          onChange={handleChangeCode}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={handleChangePassword}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default ResetPasswordPage;
