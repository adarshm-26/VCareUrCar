import React from 'react';
import { Header, Footer } from './Components';
import { Container, Row, Col, CardDeck, Card } from 'react-bootstrap';
import thumbs from '../images/thumbs.png';
import spanner from '../images/spanner.png';
import people from '../images/people.png';

export const About = (props) => {
  return (<>
    <Header/>
    <Container style={{
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: '10rem',
      textAlign: 'start',
    }}>
      <Row>
        <Col>
          <h2>About Us</h2>
        </Col>
      </Row>
      <Row style={{
        padding: 20
      }}>
        <Col>
          <p>We are group of professionals with a passion for good care and love for cars.<br/>
            Founded in 1996 by Akash Trivedi and Divya Subramaniam, VCareUrCar has been going strong<br/>
            with about <strong>8 thousand</strong> cars serviced and counting till date.
          </p>
        </Col>
      </Row>
      <Row>
        <CardDeck>
          {
            [
              { slogan: '8k+ cars serviced', img: spanner },
              { slogan: 'No complaints till date', img: thumbs },
              { slogan: 'Growing as we speak', img: people }
            ].map((data, index) => <Card className='raised-card'>
              <Card.Img 
                src={data.img} 
                alt='Works' 
                key={index} 
                style={{ 
                  height: '20rem',
                  width: '20rem',
                  objectPosition: '0 50px',
                  objectFit: 'contain',
                  opacity: '75%',
                }}/>
              <Card.ImgOverlay style={{
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                height: '100%',
                fontSize: '2rem',
                color: '#000000',
                textShadow: '0 0 0.5rem #d9f8ff',
              }}>
                <Card.Title>{data.slogan}</Card.Title>
              </Card.ImgOverlay>
            </Card>)
          }
        </CardDeck>
      </Row>
    </Container>
    <Footer/>
  </>);
}
