import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/auth';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { token } = useAuth();
  console.log(token);
  return(
    <Route {...rest} render={props => {
      return token !== undefined ?
      <Component {...props} /> :
      <Redirect to='/login'/>
    }}
    />
  );
}
