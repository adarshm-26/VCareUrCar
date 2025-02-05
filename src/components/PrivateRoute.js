import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  return(
    <Route {...rest} render={props => {
      return localStorage.getItem('token') !== null ?
      <Component {...props} /> :
      <Redirect to={{
        pathname: '/login',
        state: {
          redirectFrom: rest.path
        }
      }}/>
    }}
    />
  );
}
