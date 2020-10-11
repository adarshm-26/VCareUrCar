import React from 'react';
import { Carousel, Container } from 'react-bootstrap';
import { Header } from './Components';
import car1 from '../images/car1.png';
import car2 from '../images/car2.jpg';
import car3 from '../images/car3.jpg';

export const Home = () => {
  const [headerStyle, setHeaderStyle] = React.useState({
    backgroundColor: 'rgba(0,0,0,0.2)',
    fontColor: '#ffffff'
  });

  React.useEffect(() => {
    const handleScroll = (event) => {
      let scrollTop = window.scrollY;
      if (scrollTop !== 0) {
        setHeaderStyle(undefined);
      } 
      else {
        setHeaderStyle({
          fontColor: '#ffffff',
          backgroundColor: 'rgba(0,0,0,0.2)'
        });
      }
    }
    window.addEventListener('scroll', handleScroll);
    return (() => {
      window.removeEventListener('scroll', handleScroll);
    });
  }, []);

  return (<>
    <Header {...headerStyle}/>
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={car1}
          alt="First slide"
        />
        <Carousel.Caption>
          <h2>Top quality servicing</h2>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={car2}
          alt="Third slide"
        />
        <Carousel.Caption>
          <h2>Best in town</h2>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={car3}
          alt="Third slide"
        />
        <Carousel.Caption>
          <h2>Assurance guaranteed</h2>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    <Container>

    </Container>
    <Container>

    </Container>
    <Container>

    </Container>
  </>);
}