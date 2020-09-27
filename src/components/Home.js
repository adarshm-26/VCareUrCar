import React from 'react';
import { useAuth } from '../context/auth';
import { Navbar, Nav, Button, Carousel } from 'react-bootstrap';
import { Header } from './Components';
import car1 from '../images/car1.png';
import car2 from '../images/car2.jpg';
import car3 from '../images/car3.jpg';

export const Home = () => {

  return (<>
    <Header/>
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={car1}
          alt="First slide"
        />
        <Carousel.Caption>
          <h1>Top quality servicing</h1>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={car2}
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>Best in town</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={car3}
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>Assurance guaranteed</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  </>);
}