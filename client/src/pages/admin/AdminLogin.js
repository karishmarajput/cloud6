import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

function AdminLogin() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleemailChange = (e) => {
    setemail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log(response)
      if (response.ok) {
        const data = await response.json();
        const authToken = data.token;
        localStorage.setItem('authToken', authToken);
        navigate('/admin-dashboard');
      } else {
        alert('Invalid email or password');
      }
      setemail('');
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
                <label htmlFor="ogNumber">Email:</label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={handleemailChange}
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
