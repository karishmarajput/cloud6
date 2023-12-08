import React from "react";
import "./MainPage.css";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";

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
      {/* <div className="row">
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
      </div> */}
      <Container>
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <h1 className="display-4 font-weight-bold mb-4">
              Wake. Generate. Verify. Repeat.
            </h1>
            <p className="lead">Your description goes here...</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MainPage;
