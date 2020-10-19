import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { carIcon, 
  facebookIcon, 
  contactIcon, 
  instaIcon, 
  mapPointerIcon, 
  pageIcon, 
  twitterIcon } from './Components';

export const Footer = (props) => {
  return <div style={{
    background: '#000000',
    padding: 30
  }}>
    <Row style={{
      fontFamily: 'Ubuntu',
      fontSize: '1.15rem',
      textAlign: 'start',
      color: '#d9f8ff',
    }}>
      <Col>
        <h3>Corporate Address</h3><br/>
        {mapPointerIcon} 1451, Route No. 16,<br/>
        Rajdhani Marg, Delhi<br/>
        PIN - 744105<br/><br/>
      </Col>
      <Col>
        <h3>Company</h3><br/>
        <a className='anchor' href='/contact'>{contactIcon} Contact Us</a><br/>
        <a className='anchor' href='/terms'>{pageIcon} Terms & Conditions</a><br/>
        <a className='anchor' href='/about'>{carIcon} About</a><br/>
        <a className='anchor' href='/privacyPolicy'>{pageIcon} Privacy Policy</a><br/><br/>
      </Col>
      <Col style={{
          marginTop: 'auto',
        }}>
        <div style={{ widht: '50%', justifyContent: 'space-around' }}>{facebookIcon} {twitterIcon} {instaIcon}</div><br/>
        Copyright © 2020 VCareUrCar<br/>
        Licensed under GNU GPLv3<br/>
        All rights reserved<br/>
      </Col>
    </Row>
  </div>
}
