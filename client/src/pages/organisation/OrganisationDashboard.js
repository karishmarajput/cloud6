import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GenerateCertificate from './GenerateCertificate';

function OrganisationDashboard(){
  const navigate = useNavigate();
    const handleGenerateCertificate = () => {
        
      navigate('/generate-certificate');
      };
    const handleuploadTemplate=()=>{
      navigate('/upload-template');
    }
    return(
        <div>

            Dashboard
            <button onClick={handleGenerateCertificate}>Generate Certificate</button>
            <button onClick={handleuploadTemplate}>Upload Template</button>
        </div>
    )
}
export default OrganisationDashboard