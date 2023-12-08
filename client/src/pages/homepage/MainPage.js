import React from "react";
import "./MainPage.css";

const MainPage = () => {
  return (
    <div className="main-page container">
      <ul class="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
        </ul>
      <div className="row">
        <div className="heading col-md-6" style={{ color: "#F1F4F7" }}>
          <h3 className="display-7">Welcome to</h3>
          <h1 className="display-4" style={{ fontWeight: "bold" }}>
            <b>Certificate Verification</b>
          </h1>
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
