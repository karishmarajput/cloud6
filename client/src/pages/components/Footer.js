import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <Container>
        <Row>
          <Col md={6} className="text-center text-md-left">
            <p className="mb-0">
              &copy; 2023 Your Company Name. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-right">
            <p className="mb-0">
              <a href="/" className="text-white mx-2">
                Home
              </a>
              <span className="text-muted">|</span>
              <a href="/features" className="text-white mx-2">
                Features
              </a>
              <span className="text-muted">|</span>
              <a href="/our-story" className="text-white mx-2">
                Our Story
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
