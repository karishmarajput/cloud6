import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function AdminDashboard() {
  const [organisations, setOrganisations] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchOrganisations(); // Fetch organisations on component mount
  }, []);

  const fetchOrganisations = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/unverified-organisations');
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      setOrganisations(data);
    } catch (error) {
      console.error('Error fetching organisations:', error);
    }
  };

  const handleVerify = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/verify-organisation/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), // Pass the organisation ID to verify
      });
      if (!response.ok) {
        throw new Error('Verification failed');
      }
      // If successful, fetch organisations again to update the list
      fetchOrganisations();
    } catch (error) {
      console.error('Error verifying organisation:', error);
    }
  };
  const handleListAll = () => {
    // Navigate to the ListAllOrganisation page on button click
    navigate('/list-all-organisation');
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>New Organisations</h3>
      <button onClick={handleListAll}>List All</button>
      <table>
        <thead>
          <tr>
            <th>OG Number</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {organisations.map((org) => (
            <tr key={org._id}>
              <td>{org.ogNumber}</td>
              <td>{org.name}</td>
              <td>{org.phoneNumber}</td>
              <td>{org.email}</td>
              <td>
                <button onClick={() => handleVerify(org._id)}>Verify</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
