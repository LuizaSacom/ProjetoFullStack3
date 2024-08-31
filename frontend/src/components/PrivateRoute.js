import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // Se o token não estiver presente, redirecione para a página inicial
  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
