import React from 'react';
import { Button } from 'react-bootstrap';

export const StyledButton = (props) => {
  return <Button 
    {...props}
    style={{
      background: '#D9F8FF',
      border: '1.2px solid #000000',
      borderRadius: '5.5px',
      fontFamily: 'Sansita',
      color: '#000000',
      ...props.style
    }}>
      {props.label}
  </Button>
}