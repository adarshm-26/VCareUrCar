import React, { useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Header, Alert, Button } from './Components';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { post } from '../Utils';

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
  cpassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
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
      password: '',
      cpassword: '',
      enable:false
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      console.log('Registering....');
      try {
        delete (values.cpassword);
        let result = await post('/user/register', {
          ...values,
          type: 'customer'
        }, { getResult: false, withAuth: false });
        alert(result);
        localStorage.setItem('usermail',values.email);
        localStorage.setItem('userpassword',values.password);
        history.push('/verifymail');
      } catch (e) {
        console.error(e);
        setOnError(e.message);
      }
    }
  });

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
        <Card.Title>Register</Card.Title>
        <Card.Subtitle>enter your details</Card.Subtitle>
        <Form onSubmit={formik.handleSubmit}>
        {
          [{ place: 'Name',            name: 'name',      type: 'text' },
          { place: 'Age',              name: 'age',       type: 'number' },
          { place: 'Phone',            name: 'phone',     type: 'number' },
          { place: 'Email',            name: 'email',     type: 'text' },
          { place: 'Password',         name: 'password',  type: 'password' },
          { place: 'Confirm Password', name: 'cpassword', type: 'password' }]
          .map((value, index) => {
            return (<>
              <Form.Control style={{ marginTop: 20 }}
                type={value.type}
                name={value.name}
                value={formik.values[value.name]}
                placeholder={value.place}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <div style={{ color: 'red', textAlign: 'start' }}>
              {
                formik.touched[value.name] ?
                formik.errors[value.name] : ''
              }
              </div>
            </>);
          })
        }
          <Button 
            style={{ marginTop: '15px' }}
            type='submit'
            label='Register'/>
        </Form>
      </Card.Body>
    </Card>
    <Alert onError={onError} setOnError={setOnError}/>
  </div>);  
}