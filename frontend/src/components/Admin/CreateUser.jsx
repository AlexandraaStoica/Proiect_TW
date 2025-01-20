import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createUser } from "../../store/slices/userSlice";
import axios from "axios";

function CreateUser() {
  const dispatch = useDispatch();
  const [managers, setManagers] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "USER",
    managerId: ""
  });

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3000/api/users/managers", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setManagers(response.data);
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    fetchManagers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.role === "USER" && !formData.managerId) {
      alert("Please select a manager for the user");
      return;
    }

    try {
      await dispatch(createUser(formData)).unwrap();
      alert("User created successfully!");
      setFormData({
        email: "",
        password: "",
        role: "USER",
        managerId: ""
      });
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user");
    }
  };

  return (
    <div className="p-6 w-full flex justify-center">
      <form className="card w-96 bg-base-100 shadow-xl" onSubmit={handleSubmit}>
        <div className="card-body">
          <h2 className="card-title">Create New User</h2>
          
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <select
            className="select select-bordered w-full"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value, managerId: "" })}
            required
          >
            <option value="USER">User</option>
            <option value="MANAGER">Manager</option>
          </select>

          {formData.role === "USER" && (
            <select
              className="select select-bordered w-full"
              value={formData.managerId}
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
              required
            >
              <option value="">Select Manager</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.email}
                </option>
              ))}
            </select>
          )}

          <button className="btn btn-primary mt-4" type="submit">
            Create User
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateUser;