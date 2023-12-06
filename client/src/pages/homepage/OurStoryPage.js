import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./OurStoryPage.css";

const OurStoryPage = () => {
  return (
    <section className="our-story-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} className="mb-4 text-left">
            <h2 className="mb-3 display-4">Our Story</h2>
            <br />
            <p>
              Welcome to Verifier, where our journey began with a vision to
              simplify and secure the process of certificate verification and
              generation. We understand the importance of reliable certification
              in various fields and the challenges that come with ensuring the
              authenticity of these documents.
            </p>
            <br />
            <p>
              Inspired by the need for a trustworthy solution, we embarked on a
              mission to develop a user-friendly platform that streamlines the
              verification process while providing robust security measures. Our
              commitment to excellence and innovation has driven us to create a
              system that ensures the integrity and validity of certificates,
              making the verification experience seamless for both issuers and
              verifiers.
            </p>
          </Col>
          <Col md={6} className="mb-4 text-center">
            {/* Replace the placeholder image URL with your actual image URL */}
            <img
              src="https://via.placeholder.com/400x200"
              alt="Certificate Verification Image"
              className="img-fluid rounded elongated-rectangle"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default OurStoryPage;
