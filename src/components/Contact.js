import React from 'react';
import { Header, Footer } from './Components';
import { Container, Row, Col } from 'react-bootstrap';

export const Contact = (props) => {
  return (<>
    <Header/>
    <Container style={{
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      paddingTop: '10rem',
      textAlign: 'start'
    }}>
      <Row>
        <Col>
          <h2>Feedback</h2>
        </Col>
      </Row>
      <Row style={{
        padding: 20
      }}>
        <Col>
          <p>You may contact us regarding any problems or 
            issues that you may have faced while availing our services</p>
        </Col>
        <Col>
          <strong><p>Call us at : 03192 - 283211<br/>
          or Email at : feedback@vcareurcar.com</p></strong>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Legal</h2>
        </Col>
      </Row>
      <Row style={{
        padding: 20
      }}>
        <Col>
          <p>Any legal enquiries involving VCareUrCar should be followed here</p>
        </Col>
        <Col>
          <strong><p>Call us at : 03192 - 221212<br/>
          or Email at : legal@vcareurcar.com</p></strong>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Careers</h2>
        </Col>
      </Row>
      <Row style={{
        padding: 20
      }}>
        <Col>
          <p>Contact here for any information regarding career oppurtunities</p>
        </Col>
        <Col>
          <strong><p>Call us at : 03192 - 213261<br/>
          or Email at : careers@vcareurcar.com</p></strong>
        </Col>
      </Row>
    </Container>
    <Footer/>
  </>);
}