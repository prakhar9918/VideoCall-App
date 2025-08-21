import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // ✅ define navigate

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = { username, password };

    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // send cookies
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errData = await response.json();
        setMessage(errData.message || 'Login failed');
        return;
      }

      const data = await response.json();
      setMessage(data.message || 'Login successful');

      // ✅ Navigate only after success
      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Something went wrong. Try again!');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <button type="submit">Login</button>
        <br />

        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </form>

      {/* ✅ Show message instead of alert */}
      {message && <p>{message}</p>}
    </>
  );
};

export default Login;
