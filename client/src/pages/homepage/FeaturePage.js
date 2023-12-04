import React from "react";
import "./FeaturePage.css";

const FeaturePage = () => {
  return (
    <div className="feature-page text-center">
      <h2 className="display-4 mb-4">Key Features</h2>
      <div className="feature-list row">
        <div className="col-md-4 mb-4">
          <div className="feature-card">
            <img
              src="https://via.placeholder.com/150"
              alt="Secure Verification"
              className="img-fluid mb-3"
            />
            <h4>Secure Verification</h4>
            <p>
              Our platform ensures the security and authenticity of certificate
              verification.
            </p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="feature-card">
            <img
              src="https://via.placeholder.com/150"
              alt="User-friendly Interface"
              className="img-fluid mb-3"
            />
            <h4>User-friendly Interface</h4>
            <p>
              Enjoy a user-friendly interface for a seamless and intuitive
              verification process.
            </p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="feature-card">
            <img
              src="https://via.placeholder.com/150"
              alt="Fast and Reliable"
              className="img-fluid mb-3"
            />
            <h4>Fast and Reliable</h4>
            <p>
              Experience fast and reliable verification services, ensuring quick
              results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturePage;
