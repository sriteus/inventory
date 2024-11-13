import React from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

interface DecodedToken {
  exp: number;
  username: string;
  // Add other token claims as needed
}

const isTokenExpired = (token: string) => {
  const decoded: DecodedToken = jwtDecode(token);
  return decoded.exp * 1000 < Date.now(); // exp is in seconds
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = Cookies.get('token');

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
