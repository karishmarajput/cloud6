import React from "react";
import "./MainPage.css";

const MainPage = () => {
  return (
    <div className="main-page container">
      <div className="row">
        <div className="heading col-md-6">
          <h3 className="display-6">Welcome to</h3>
          <h1 className="display-3">Certificate Verification</h1>
          <p className="lead">
            Verify the authenticity of certificates easily with our platform.
          </p>
        </div>
        <div className="col-md-6 text-center">
          <img
            src="certifss.png"
            width={360}
            height={480}
            alt="Certificate Verification Image"
            className="img-fluid rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
