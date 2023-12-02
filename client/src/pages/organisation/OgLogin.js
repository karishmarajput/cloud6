import React, { useState,useEffect } from 'react';
import OrganisationDashboard from './OrganisationDashboard';
function OgLogin() {
  const [ogNumber, setOgNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    // Check local storage for authentication token on component mount
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setLoggedIn(true);
    }
  }, []);
  const handleOgNumberChange = (e) => {
    setOgNumber(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/organisation/oglogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ogNumber,
          password,
        }),
      });

      if (response.ok) {
        // If login is successful, redirect or render the organisation dashboard
        console.log('Login successful!');
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        setLoggedIn(true);
        // Redirect or render organisation dashboard
      } else {
        // Handle incorrect login details
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    // Reset the form after handling the login data
    setOgNumber('');
    setPassword('');
  };
  if (loggedIn) {
    return <OrganisationDashboard />;
  }
  return (
    <div>
      <h2>Login Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Organisation Number:
            <input
              type="text"
              value={ogNumber}
              onChange={handleOgNumberChange}
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default OgLogin;
