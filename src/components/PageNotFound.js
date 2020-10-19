import React from 'react';
import { Header, Footer } from './Components';

export const PageNotFound = (props) => {
  return (<>
    <Header/>
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      height: '100vh'
    }}>
      <p><h2>The page you are looking for does not exist</h2><br/>
      <h4 style={{ fontFamily: 'Source' }}>URL: {props.location.pathname}</h4></p>
    </div>
    <Footer/>
  </>);
}