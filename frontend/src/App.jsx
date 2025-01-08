import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, fetchUser, logoutUser } from "./store/slices/authSlice";
import Login from "./components/Login";
import CreateUser from "./components/Admin/CreateUser";
import CreateTask from "./components/Manager/CreateTask";
import TaskList from "./components/User/TaskList";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuth from "./hooks/useAuth";

function App() {
  const { isLoggedIn, token } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(fetchUser(token));
    } else {
      navigate("/login");
    }
  }, [token, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div>
      {isLoggedIn && (
        <button className="btn btn-primary  m-4" onClick={handleLogout}>
          Logout
        </button>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/users/create" element={<CreateUser />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["MANAGER"]} />}>
          <Route path="/tasks/create" element={<CreateTask />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["MANAGER", "USER"]} />}>
          <Route path="/tasks" element={<TaskList />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
