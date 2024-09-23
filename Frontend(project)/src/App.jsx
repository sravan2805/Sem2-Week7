import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import AdminProfile from './components/AdminProfile';
import UserManagement from './components/UserManagement'; // Optional

function App() {
  return (
    <Router>
      <Routes>
        <Route path="http://localhost:3000/api/member/signup" element={<Signup />} />
        <Route path="http://localhost:3000/api/member/login" element={<Login />} />
        <Route path="http://localhost:3000/api/member/login" element={<UserProfile />} />
        <Route path="http://localhost:3000/api/admin/login" element={<AdminProfile />} />
        <Route path="http://localhost:3000/api/admin/users" element={<UserManagement />} /> {/* Optional for user management */}
      </Routes>
    </Router>
  );
}

export default App;
