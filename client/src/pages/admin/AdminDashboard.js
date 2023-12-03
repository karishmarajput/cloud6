import React, { useState, useEffect } from 'react';

function AdminDashboard() {
  const [unverifiedOrganizations, setUnverifiedOrganizations] = useState([]);

  useEffect(() => {
    // Fetch unverified organizations data from the backend
    fetch('http://localhost:5000/admin/unverified-organisations')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log(response)
        return response.json();
      })
      .then((data) => {
        // Filter out the organizations that are not verified
        const unverifiedData = data.filter((org) => !org.isVerified);
        setUnverifiedOrganizations(unverifiedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>New Organisations</h3>
      <ul>
        {unverifiedOrganizations.map((org) => (
          <li key={org.id}>{org.ogNumber}-{org.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
