import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createUser } from "../../store/slices/userSlice";
import axios from "axios";

function CreateUser() {
  const [managers, setManagers] = useState([]);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "USER",
    managerId: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createUser(formData));
  };

  useEffect(() => {
    const fetchManagers = async () => {
      const response = await axios.get("/api/users/managers");
      setManagers(Array.isArray(response.data) ? response.data : []);
    };
    fetchManagers();
  }, []);

  return (
    <div className="p-6 w-full flex justify-center">
      <form className="card w-96 bg-base-100 shadow-xl" onSubmit={handleSubmit}>
        <div className="card-body">
          <h2 className="card-title">Create New User</h2>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <select
            className="select select-bordered w-full"
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="USER">User</option>
            <option value="MANAGER">Manager</option>
          </select>

          {formData.role === "USER" && (
            <select
              className="select select-bordered w-full"
              onChange={(e) =>
                setFormData({ ...formData, managerId: e.target.value })
              }
            >
              <option value="">Select Manager</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.email}
                </option>
              ))}
            </select>
          )}

          <button className="btn btn-primary mt-4">Create User</button>
        </div>
      </form>
    </div>
  );
}

export default CreateUser;
