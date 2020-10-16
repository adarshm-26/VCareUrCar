import React from 'react';
import { Row, Col } from 'react-bootstrap';

export const Footer = (props) => {
  return <div style={{
    marginTop: '14rem',
    background: '#000000',
    padding: 30
  }}>
    <Row style={{
      fontFamily: 'Inconsolata semibold',
      fontSize: '1.15rem',
      textAlign: 'start',
      color: '#d9f8ff',
    }}>
      <Col>
        <h3>Corporate Address</h3><br/>
        1451, Route No. 16,<br/>
        Rajdhani Marg, Delhi<br/>
        PIN - 744105<br/><br/>
      </Col>
      <Col>
        <h3>Company</h3><br/>
        <a className='anchor' href='/contact'>Contact Us</a><br/>
        <a className='anchor' href='/terms'>Terms & Conditions</a><br/>
        <a className='anchor' href='/about'>About</a><br/>
        <a className='anchor' href='/privacyPolicy'>Privacy Policy</a><br/><br/>
      </Col>
      <Col style={{
          marginTop: 'auto',
        }}>
        Copyright © 2020 VCareUrCar<br/>
        Licensed under GNU GPLv3<br/>
        All rights reserved<br/>
      </Col>
    </Row>
  </div>
}
