import React, { useState, useEffect } from 'react';

function ListAllOrganisation() {
  const [verifiedOrganisations, setVerifiedOrganisations] = useState([]);

  useEffect(() => {
    fetchVerifiedOrganisations(); // Fetch verified organisations on component mount
  }, []);

  const fetchVerifiedOrganisations = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/verified-organisations');
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      setVerifiedOrganisations(data);
    } catch (error) {
      console.error('Error fetching verified organisations:', error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/delete-organisation/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Couldn\'t Delete');
      }
      fetchVerifiedOrganisations();
    } catch (error) {
      console.error('Error verifying organisation:', error);
    }
  };

  return (
    <div>
      <h2>List of Verified Organisations</h2>
      <table>
        <thead>
          <tr>
            <th>OG Number</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Delete Organisation</th>
           
          </tr>
        </thead>
        <tbody>
          {verifiedOrganisations.map((org) => (
            <tr key={org._id}>
              <td>{org.ogNumber}</td>
              <td>{org.name}</td>
              <td>{org.phoneNumber}</td>
              <td>{org.email}</td>
              <td>
              <button onClick={() => handleDelete(org._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListAllOrganisation;
