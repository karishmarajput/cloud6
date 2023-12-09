import React from "react";
import "./MainPage.css";
import { Container, Row, Col } from "react-bootstrap";
import { TypeAnimation } from "react-type-animation";
import Button from "react-bootstrap/Button";

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
      <img className="art-bc" src="art-bc.png" />
      <img className="art-spiral" src="art-spiral.png" />
      <img className="art-shield" src="art-shield.png" />
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
      <Container style={{ zIndex: 10 }}>
        <Row className="d-flex align-items-center justify-content-center">
          <Col md={8} lg={12} className="text-center">
            <h1 className="display-4 font-weight-bold mb-4 header-text">
              WAKE. GENERATE.
              <br />
              VERIFY. REPEAT.
            </h1>
            <p className="lead">
              Empowering Trust Through Seamless Certificate <br />
              Verification and Generation.
            </p>
            <Button href="" variant="primary" className="btn">
              <b>Verify</b>
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MainPage;
