import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRole }) {
  const role = localStorage.getItem('role');

  const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];

  if (allowedRoles.includes(role)) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
