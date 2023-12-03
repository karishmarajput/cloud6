import React from "react";
import "./MainPage.css";

const MainPage = () => {
  return (
    <div className="main-page container">
      <div className="row">
        <div className="col-md-6">
          <h1 className="display-4">Welcome to Certificate Verification</h1>
          <p className="lead">
            Verify the authenticity of certificates easily with our platform.
          </p>
        </div>
        <div className="col-md-6 text-center">
          <img
            src="https://via.placeholder.com/400x300"
            alt="Certificate Verification Image"
            className="img-fluid rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
