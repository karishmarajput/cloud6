import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GenerateCertificate from './GenerateCertificate';

function OrganisationDashboard(){
  const navigate = useNavigate();
    const handleGenerateCertificate = () => {
        
      navigate('/generate-certificate');
      };
    return(
        <div>

            Dashboard
            <button onClick={handleGenerateCertificate}>Generate Certificate</button>
        </div>
    )
}
export default OrganisationDashboard