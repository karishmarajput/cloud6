import React, { useState } from 'react';

function OgRegister() {
  const [organizationNumber, setOrganizationNumber] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const handlePasswordChange = (e) => {
  setPassword(e.target.value);
};
  const handleOrgNumberChange = (e) => {
    setOrganizationNumber(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/organisation/ogregister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ogNumber: organizationNumber,
          name,
          phoneNumber,
          email,
          password
        }),
      });

      if (response.ok) {
        // Handle success, e.g., show a success message or redirect
        console.log('Registration successful! You will receive a mail once verified by admin');
      } else {
        // Handle error, e.g., show an error message
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    // Reset the form after handling the registration data
    setOrganizationNumber('');
    setName('');
    setPhoneNumber('');
    setEmail('');
    setPassword('');
  };

  return (
    <div>
      <h2>Register Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Organization Number:
            <input
              type="text"
              value={organizationNumber}
              onChange={handleOrgNumberChange}
            />
          </label>
        </div>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
            />
          </label>
        </div>
        <div>
          <label>
            Phone Number:
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneChange}
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
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
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}

export default OgRegister;
