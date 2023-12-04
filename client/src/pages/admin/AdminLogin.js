import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Retrieve the authentication token from the response
        const data = await response.json();
        const authToken = data.token;

        // Store the authentication token in local storage
        localStorage.setItem('authToken', authToken);

        // Redirect to AdminDashboard upon successful login
        navigate('/admin-dashboard');
      } else {
        // Handle login failure, show error message or take appropriate action
        alert('Invalid username or password');
      }

      // Reset the form after handling the login data
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container">
        <div className="flex-container-login">
          <div className="image-section-login">
            <img src="admin-login-side.jpg" alt="yo" />
          </div>
          <div className="form-section-login">
            <h2>Admin Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group-login">
                <label htmlFor="ogNumber">Username:</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>
              <div className="form-group-login">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="form-group-login-button">
                <button type="submit">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}

export default AdminLogin;
