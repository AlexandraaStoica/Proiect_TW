import React from 'react';
import { Link } from 'react-router-dom';
import UserList from './UserList';

function AdminDashboard() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Link to="/users/create" className="btn btn-primary">
            Create New User
          </Link>
        </div>


        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">User Management</h2>
            <UserList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;