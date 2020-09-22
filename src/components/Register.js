import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

export const Register = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');

  return (<>
    <Card style={{ width: '35%', maxWidth: '350px', margin: 'auto', marginTop: '40px' }}>
      <Card.Body>
        <Card.Title>Register</Card.Title>
        <Card.Subtitle>enter your details</Card.Subtitle>
        <Form onSubmit={ async (e) => {
          e.preventDefault();
          console.log('Registering....');
          let response = await fetch({
            method: 'POST',
            url: 'http://localhost:1112/user/register',
            headers: {
              'content-type': 'application/json'
            }
          });
          let result = await response.json();
          alert(result);
        }}>
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type='text' 
            name='name'
            value={name}
            onChange={(val) => 
              setName(val)
            }/>
          <Form.Label>Phone</Form.Label>
          <Form.Control 
            type='text' 
            name='age'
            value={phone}
            onChange={(val) => 
              setPhone(val)
            }/>
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type='text' 
            name='email'
            value={email}
            onChange={(val) => 
              setEmail(val)
            }/>
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type='password' 
            name='password'
            value={password}
            onChange={(val) => 
              setPassword(val)
            }/>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control 
            type='password' 
            name='cpassword'
            value={cpassword}
            onChange={(val) => 
              setCPassword(val)
            }/>
          <Button 
            style={{ marginTop: '10px' }}
            type='submit'
          >Register
          </Button>
        </Form>
      </Card.Body>
    </Card>
  </>);  
}