import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:3000/api/admin/change-password', { newPassword });
      alert("Password changed successfully!");
    } catch (err) {
      alert("Failed to change password: " + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('http://localhost:3000/api/admin/deleteAccount');
      alert("Account deleted successfully!");
      navigate('/signup');
    } catch (err) {
      alert("Failed to delete account: " + err.message);
    }
  };

  const handleLogout = () => {
    alert("Logged out successfully!");
    navigate('/login');
  };

  return (
    <div>
      <h2>Admin Profile</h2>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
      <button onClick={handleDeleteAccount} style={{ backgroundColor: 'red', color: 'white' }}>Delete Account</button>
      <button onClick={handleLogout} style={{ backgroundColor: 'blue', color: 'white' }}>Logout</button>
    </div>
  );
};

export default AdminProfile;
