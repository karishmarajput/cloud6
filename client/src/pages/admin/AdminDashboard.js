import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function AdminDashboard() {
  const [organisations, setOrganisations] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchOrganisations();
  }, []);

  const fetchOrganisations = async () => {
    

      
      try {
        const authToken = localStorage.getItem('authToken'); 
        const headers = {
          Authorization: `Bearer ${authToken}`
        };
    
        const response = await fetch('http://localhost:8000/admin/home', {
          headers: headers 
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
    
        const data = await response.json();

        setOrganisations(data.data);
      } catch (error) {
        console.error('Error fetching organisations:', error);
      }
  };

  const handleVerify = async (id) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      };
  
      const response = await fetch(`http://localhost:8000/admin/verifyUser/${id}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ id }), 
      });
  
      if (!response.ok) {
        throw new Error('Verification failed');
      }
  
      fetchOrganisations();
    } catch (error) {
      console.error('Error verifying organisation:', error);
    }
  };
  
  const handleListAll = () => {
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

            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>

        {Array.isArray(organisations) && organisations.length > 0 ? (
          organisations.map((org) => (
            <tr key={org._id}>
     
              <td>{org.name}</td>
              <td>{org.phoneNumber}</td>
              <td>{org.email}</td>
              <td>
                <button onClick={() => handleVerify(org._id)}>Verify</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No organisations found</td>
          </tr>
        )}
         
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
