import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

function NavbarCertif() {
  const headStyle = {
    zIndex: 10,
  };
  return (
    <Navbar expand="lg" data-bs-theme="light" style={headStyle}>
      <Container>
        <Navbar.Brand
          style={{ color: "#fff" }}
          href="#home"
          className="text-uppercase"
        >
          Verifier
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="ml-auto">
            <Nav.Link
              href="verify"
              style={{ marginRight: "25px", color: "#fff" }}
            >
              Verify
            </Nav.Link>
            <Nav.Link
              href="admin"
              style={{ marginRight: "25px", color: "#fff" }}
            >
              Admin Login
            </Nav.Link>
            <NavDropdown
              title="Join"
              style={{ marginRight: "15px", color: "#fff" }}
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item className="text-center" href="ogRegister">
                Register
              </NavDropdown.Item>
              <NavDropdown.Item className="text-center" href="ogLogin">
                Login
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarCertif;
