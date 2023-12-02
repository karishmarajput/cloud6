import React, { useState, useEffect } from 'react';

import GenerateCertificate from './GenerateCertificate';

function OrganisationDashboard(){
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
          setLoggedIn(true);
        }
      }, []);
    const handleGenerateCertificate = () => {
      console.log('hello')
        // Check if logged in before rendering GenerateCertificate component
        if (loggedIn) {
          console.log("hi")
          // Render the GenerateCertificate component
          return <GenerateCertificate />;
        } else {
          // User not logged in, show a message or redirect to login page
          return <p>Please login to generate a certificate</p>;
        }
      };
    return(
        <div>

            Dashboard
            <button onClick={handleGenerateCertificate}>Generate Certificate</button>
        </div>
    )
}
export default OrganisationDashboard