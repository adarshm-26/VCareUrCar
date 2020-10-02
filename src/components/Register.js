import React, { useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Header, Alert, Button } from './Components';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too short')
    .max(30, 'Too long')
    .required('Required'),
  age: Yup.number()
    .positive('Cannot be negative')
    .moreThan(18, 'Too young')
    .lessThan(80, 'Too old')
    .required('Required'),
  phone: Yup.number()
    .required('Required'),
  email: Yup.string()
    .email('Invalid address')
    .required('Required'),
  password: Yup.string()
    .min(8, 'Too short')
    .required('Required'),
});

export const Register = () => {
  const [onError, setOnError] = useState(undefined);
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      name: '',
      age: undefined,
      phone: undefined,
      email: '',
      type:'customer',
      password: '',
      cpassword: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      console.log('Registering....');
      try {
        delete (values.cpassword);
        let response = await fetch('http://localhost:1112/user/register', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(values)
        });
        let result = await response.json();
        alert(result);
        history.push('/profile');
      } catch (e) {
        console.error(e);
        setOnError(e.message);
      }
    }
  });

  return (<>
    <Header/>
    <Card style={{ 
      width: '35%', 
      maxWidth: '350px', 
      margin: 'auto', 
      marginTop: '40px',
      border: '1px solid #000000'
    }}>
      <Card.Body>
        <Card.Title>Register</Card.Title>
        <Card.Subtitle>enter your details</Card.Subtitle>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Control 
            style={{ marginTop: 20 }}
            type='text' 
            name='name'
            value={formik.values.name}
            placeholder='Name'
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}/>
          <div style={{ color: 'red', textAlign: 'start' }}>
            {
              formik.touched.name ?
              formik.errors.name : ''
            }
          </div>
          <Form.Control 
            style={{ marginTop: 20 }}
            type='number' 
            name='age'
            value={formik.values.age}
            placeholder='Age'
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}/>
          <div style={{ color: 'red', textAlign: 'start' }}>
            {
              formik.touched.age ?
              formik.errors.age : ''
            }
          </div>
          <Form.Control 
            style={{ marginTop: 20 }}
            type='number' 
            name='phone'
            value={formik.values.phone}
            placeholder='Phone'
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}/>
          <div style={{ color: 'red', textAlign: 'start' }}>
            {
              formik.touched.phone ?
              formik.errors.phone : ''
            }
          </div>
          <Form.Control 
            style={{ marginTop: 20 }}
            type='text' 
            name='email'
            value={formik.values.email}
            placeholder='Email'
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}/>
          <div style={{ color: 'red', textAlign: 'start' }}>
            {
              formik.touched.email ?
              formik.errors.email : ''
            }
          </div>
          <Form.Control 
            style={{ marginTop: 20 }}
            type='password' 
            name='password'
            value={formik.values.password}
            placeholder='Password'
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}/>
          <div style={{ color: 'red', textAlign: 'start' }}>
            {
              formik.touched.password ?
              formik.errors.password : ''
            }
          </div>
          <Form.Control 
            style={{ marginTop: 20 }}
            type='password' 
            name='cpassword'
            value={formik.values.cpassword}
            placeholder='Confirm Password'
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}/>
          <div style={{ color: 'red', textAlign: 'start' }}>
            {
              formik.touched.cpassword && 
              formik.values.password !== formik.values.cpassword ?
              'Passwords dont match' : ''
            }
          </div>
          <Button 
            style={{ marginTop: '15px' }}
            type='submit'
            label='Register'/>
        </Form>
      </Card.Body>
    </Card>
    <Alert onError={onError} setOnError={setOnError}/>
  </>);  
}