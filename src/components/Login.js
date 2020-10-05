import React, { useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Header, Alert, Button } from './Components';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { post } from '../Utils';


export const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [onError, setOnError] = useState(undefined);
  const { signIn } = useAuth();
  const history = useHistory();

  return (<div style={{ 
    display: 'flex',
    height: '100%',
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
    <Header/>
    <Card style={{ 
      width: '80%', 
      maxWidth: '20rem', 
      border: '1px solid #000000'
    }}>
      <Card.Body>
        <Card.Title>Sign In</Card.Title>
        <Card.Subtitle>using email and password</Card.Subtitle>
        <Form onSubmit={ async (e) => {
          e.preventDefault();
          console.log('Signing in....');
          try {
            let result = await post('/authenticate', {
              username: email,
              password: password
            }, { withAuth: false });
            if (result.token) {
              const token = result.token;
              signIn(token);
              if (props.location &&
                props.location.state &&
                props.location.state.redirectFrom) {
                console.log('Redirecting to ' + props.location.state.redirectFrom);
                history.push(props.location.state.redirectFrom);
              }
              else {
                history.push('/profile');
              }
            }
          } catch (e) {
            console.error(e);
            setOnError(e.message);
          }
        }}>
          <Form.Control 
            style={{ marginTop: 20 }} 
            type='text' 
            name='email'
            value={email}
            placeholder='Email'
            onChange={(val) => 
              setEmail(val.target.value)
            }/>
          <Form.Control
            style={{ marginTop: 20 }} 
            type='password' 
            name='password'
            value={password}
            placeholder='Password'
            onChange={(val) => 
              setPassword(val.target.value)
            }/>
          <Button 
            style={{ marginTop: '20px', marginBottom: '10px' }}
            type='submit'
            label='Sign In'
          />
        </Form>
        <Link 
          style={{
            color: '#000000'
          }}
          to='/register'>
            Not a member yet ?
        </Link>
      </Card.Body>
    </Card>
    <Alert onError={onError} setOnError={setOnError}/>
  </div>);  
}
