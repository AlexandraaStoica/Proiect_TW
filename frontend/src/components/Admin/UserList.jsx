import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../store/slices/userSlice';

function UserList() {
  const dispatch = useDispatch();
  const { list: users, status, error } = useSelector((state) => state.users);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchUsers(token));
    }
  }, [dispatch, token]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <span className={`badge ${
                  user.role === 'ADMIN' ? 'badge-primary' : 
                  user.role === 'MANAGER' ? 'badge-secondary' : 
                  'badge-accent'
                }`}>
                  {user.role}
                </span>
              </td>
              <td>{formatDate(user.createdAt)}</td>
      
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;