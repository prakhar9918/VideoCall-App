import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const RequireAuth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/api/users/verify-token', {
      withCredentials: true, // ✅ sends cookies
    })
    .then(() => setIsAuthenticated(true))
    .catch((err) => {
      console.error('Auth check failed:', err.response?.data || err.message);
      setIsAuthenticated(false);
    });
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

export default RequireAuth;