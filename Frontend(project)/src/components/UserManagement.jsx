import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin/users');
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users: ", err.message);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/delete-user/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
      alert("User deleted successfully!");
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.userName}
            <button onClick={() => handleDeleteUser(user.id)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
