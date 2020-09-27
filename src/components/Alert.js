import React from 'react';
import { Alert } from 'react-bootstrap';

export const StyledAlert = ({ onError, setOnError }) => {
  return (<Alert
    show={onError ? true : false}
    variant='danger'
    dismissible
    onClose={() => setOnError(undefined)}
    style={{ 
      width: '50%', 
      left: '25%',             
      position: 'absolute',
      bottom: '50px'
    }}>
    {onError}
  </Alert>);
}