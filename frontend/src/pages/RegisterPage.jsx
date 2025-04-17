import React, { useState } from 'react';
import authService from '../services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    uniqueId: '',
    role: '',
    class: '',
    department: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.registerUser(formData);
      // Redirect to login or dashboard after successful registration
      console.log(response);
    } catch (error) {
      setError('Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Unique ID"
          name="uniqueId"
          value={formData.uniqueId}
          onChange={handleChange}
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="text"
          placeholder="Class"
          name="class"
          value={formData.class}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default RegisterPage;
