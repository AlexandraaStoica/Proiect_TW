import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
  const { user, token } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" />;

  if (!user || !allowedRoles.includes(user.role))
    return <Navigate to="/login" />;

  return <Outlet />;
}

export default ProtectedRoute;
