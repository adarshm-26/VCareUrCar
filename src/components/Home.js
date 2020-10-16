import React from 'react';
import { Carousel, Container, Row, Col, Card, CardDeck } from 'react-bootstrap';
import { Header, Footer } from './Components';
import check from '../images/hiclipart.com.png';
import assured from '../images/all_good.jpg';

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
      <Carousel.Item className='bgCar1'>
        <div className='jumboText'>
          <p>
            Welcome to VCareUrCar<br/>
            <h1>The name for top quality servicing</h1>
          </p>
        </div>
      </Carousel.Item>
      <Carousel.Item className='bgCar2'>
        <div className='jumboText'>
          <p>
            Best in town
          </p>
        </div>
      </Carousel.Item>
      <Carousel.Item className='bgCar3'>
        <div className='jumboText'>
          <p>
            Assurance guaranteed
          </p>
        </div>
      </Carousel.Item>
    </Carousel>
    <Container>
      <Row style={{
        margin: '18rem 0'
      }}>
        <Col sm='6'
        className='frontCard'>
          <img
            src={check}
            alt='All good'
            style={{
              width: '100%',
              height: 'auto',
              filter: 'drop-shadow(2rem 2rem 2rem #555)' 
            }}
          />
        </Col>
        <Col sm='6'>
          <div className='frontText'>
          We make sure of everything so you don’t have to,
          from a speck of dust to that subtle noise from your car
          </div>
        </Col>
      </Row>
    </Container>
    <Container>
      <Row style={{
        margin: '18rem 0'
      }}>
        <Col sm='6'>
          <div className='frontText'>
          We provide a complete one stop shop
          for any and all needs of your car
          </div>
        </Col>
        <Col sm='6'>
          <Card
            className='frontCardAssured frontCard'>
            <img
              src={assured}
              alt='Assured'
              style={{
                objectFit: 'cover'
              }}
            />
          </Card>
        </Col>
      </Row>
    </Container>
    <Container>
      <Row style={{
        margin: '18rem 0'
      }}>
        <Row>
          <div className='frontText'>
            Our happy customers...
          </div>
        </Row>
        <Row>
          <CardDeck style={{
            margin: '1rem'
          }}>
            {
              [{ 
                  quote: 'My search stops here, I am absolutely sold on the care that my car has recieved since day one',
                  author: 'Shashank Thapar',
                  when: '2 years ago'
                },{ 
                  quote: 'VCareUrCar has completely changed my perspective on the actual servicing needs of my car',
                  author: 'Mohammed Ehab',
                  when: 'an year ago'
                },{ 
                  quote: 'Really good, on time and quality services, all my friends have no complaints too',
                  author: 'Shruti Desai',
                  when: '3 months ago'
              }].map((data, index) => 
              <Card border='info' key={index} className='raised-card'>
                <Card.Body>
                  <blockquote className="blockquote mb-0">
                    <p>
                      {` ${data.quote} `}
                    </p>
                    <footer className="blockquote-footer">
                      <cite title="Source Title">{data.author}</cite>
                    </footer>
                  </blockquote>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">Joined {data.when}</small>
                </Card.Footer>
              </Card>)
            }
          </CardDeck>
        </Row>
      </Row>
    </Container>
    <Footer/>
  </>);
}
