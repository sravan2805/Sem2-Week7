import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [userName, setuserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({ userName, password })

    try {
      // Send login request to the backend
      const res = await axios.post('http://localhost:8000/api/admin/signupAdmin', { userName, password });
      if(res){
        alert("success");
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>userName:</label>
          <input type="userName" value={userName} onChange={(e) => setuserName(e.target.value)} required />
        </div>

        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit">Login</button>

      </form>

    </div>
  );
};

export default Login;
