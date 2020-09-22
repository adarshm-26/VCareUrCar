import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';


export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  return (<>
    <Card style={{ width: '35%', maxWidth: '350px', margin: 'auto', marginTop: '40px' }}>
      <Card.Body>
        <Card.Title>Sign In</Card.Title>
        <Card.Subtitle>using email and password</Card.Subtitle>
        <Form onSubmit={ async (e) => {
          e.preventDefault();
          console.log('Signing in....');
          try {
            let response = await fetch('http://localhost:1112/authenticate', {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                'credentials': 'include',
                'cache': 'no-cache',
                'mode': 'cors'
              },
              body: JSON.stringify({
                username: email,
                password: password
              })
            });
            let result = await response.json();
            console.log(result);
            if (result.token) {
              const token = result.token;
              signIn(token);
            }
          } catch (e) {
            console.error(e);
          }
        }}>
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type='text' 
            name='email'
            value={email}
            onChange={(val) => 
              setEmail(val.target.value)
            }/>
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type='password' 
            name='password'
            value={password}
            onChange={(val) => 
              setPassword(val.target.value)
            }/>
          <Button 
            style={{ marginTop: '10px' }}
            type='submit'
          >Sign In
          </Button>
        </Form>
        <Link to='/register'>Not a member yet ?</Link>
      </Card.Body>
    </Card>
  </>);  
}