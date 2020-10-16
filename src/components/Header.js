import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { get } from '../Utils';
import { useAuth } from '../context/auth';

const icon = <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-person-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z"/>
  <path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
  <path fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/>
</svg>;

export const Header = (props) => {
  const { signOut } = useAuth();
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const [isCustomer, setCustomer] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isValid, setValid] = React.useState(false);

  React.useEffect(() => {
    const checkIfCustomer = async () => {
      if (token !== null) {
        try {
          const result = await get('/user/me');
          if (result.type === 'customer') {
            setCustomer(true);
          } else if (result.type === 'admin') {
            setAdmin(true);
          }
          if (result.id !== undefined)
            setValid(true);
        } catch (e) {
          console.error(e);
        }
      }
    }
    checkIfCustomer();
  }, [token]);

  return <Navbar 
  fixed='top' 
  expand='lg' 
  style={{ 
    backgroundColor: props.backgroundColor || '#d9f8ff' 
  }}>
  <Navbar.Brand href='/' style={{ 
    fontSize: '2rem', 
    paddingLeft: '1rem', 
    color: props.fontColor 
  }}>VCareUrCar</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav style={{ marginLeft: 'auto' }}>
      <Nav.Link href='/' style={{ color: props.fontColor }}>Home</Nav.Link>
      <Nav.Link href='/services' style={{ color: props.fontColor }}>Services</Nav.Link>
      {
        isValid ?
        <>
          <Nav.Link href='/jobs' style={{ color: props.fontColor }}>My Jobs</Nav.Link>
          { 
            isCustomer || isAdmin ?
            <Nav.Link href='/cars' style={{ color: props.fontColor }}>My Cars</Nav.Link>
            : <></> 
          }
          {
            isAdmin ?
            <Nav.Link href='/reports' style={{ color: props.fontColor }}>Reports</Nav.Link>
            : <></>
          }
          <Nav.Link href='/profile' style={{ color: props.fontColor }}>{icon}</Nav.Link>
          <Nav.Link onClick={signOut} style={{ color: props.fontColor }}>Sign Out</Nav.Link>
        </> :
        <Nav.Link href="/login" style={{ color: props.fontColor }}>SignIn</Nav.Link>
      }
    </Nav>
  </Navbar.Collapse>
  </Navbar>
}