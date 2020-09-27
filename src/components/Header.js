import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { useAuth } from '../context/auth';

const icon = <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-person-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z"/>
  <path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
  <path fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/>
</svg>;

export const Header = () => {
  const { signOut } = useAuth();

  return <Navbar style={{ background: '#d9f8ff' }}>
  <Navbar.Brand href='/' style={{ fontSize: '2rem', paddingLeft: '30px'}}>VCareUrCar</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav style={{ marginLeft: 'auto' }}>
      <Nav.Link href='/'>Home</Nav.Link>
      <Nav.Link href="#link">Services</Nav.Link>
      {
        localStorage.getItem('token') !== null ?
        <>
          <Nav.Link href='/jobs'>My Jobs</Nav.Link>
          <Nav.Link href='/cars'>My Cars</Nav.Link>
          <Nav.Link href='/profile'>{icon}</Nav.Link>
          <Nav.Link onClick={signOut}>Sign Out</Nav.Link>
        </> :
        <Nav.Link href="/login">SignIn</Nav.Link>
      }
    </Nav>
  </Navbar.Collapse>
  </Navbar>
}