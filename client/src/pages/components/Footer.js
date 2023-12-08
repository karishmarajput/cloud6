import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  const linkStyle = {
    color: "#ffffff",
    textDecoration: "none", // Remove underline
  };
  return (
    <footer className="text-white py-4" style={{ backgroundColor: "#4e54c8" }}>
      <Container>
        <Row>
          <Col md={6} className="text-center text-md-left">
            <p className="mb-0">&copy; 2023 Verifier. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-center text-md-right">
            <p className="mb-0">
              <a href="/" className="text-white mx-2" style={linkStyle}>
                Home
              </a>
              <span className="text-muted">|</span>
              <a href="/features" className="text-white mx-2" style={linkStyle}>
                Features
              </a>
              <span className="text-muted">|</span>
              <a
                href="/our-story"
                className="text-white mx-2"
                style={linkStyle}
              >
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
