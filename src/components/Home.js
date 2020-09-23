import React from 'react';
import { useAuth } from '../context/auth';
import { Navbar, Nav, Button, Carousel } from 'react-bootstrap';
import car1 from '../images/car1.jpg';
import car2 from '../images/car2.jpg';
import car3 from '../images/car3.jpg';

export const Home = () => {

  return (<>
    <Navbar style={{ background: '#d9f8ff' }}>
      <Navbar.Brand href='/' style={{ fontSize: '2rem', paddingLeft: '30px'}}>VCareUrCar</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav style={{ marginLeft: 'auto', marginRight: '30px' }}>
          <Nav.Link href='/'>Home</Nav.Link>
          <Nav.Link href="#link">Services</Nav.Link>
          {
            localStorage.getItem('token') !== null ?
            <Nav.Link href='/profile'>Profile</Nav.Link> :
            <Nav.Link href="/login">SignIn</Nav.Link>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={car1}
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={car2}
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={car3}
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  </>);
}