import React from 'react';
import { Card, Spinner, Row, Col, Container, Modal, Form } from 'react-bootstrap';
import { Header, Alert, Button, profileIcon, refreshIcon } from './Components';
import { get, post } from '../Utils';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const RegisterEmployeeSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too short')
    .max(30, 'Too long')
    .required('Required'),
  type: Yup.string()
    .oneOf([
      'customer',
      'supervisor',
      'technician',
      'admin'
    ], 'Invalid user type')
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

export const Profile = () => {
  const [user, setUser] = React.useState('');
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = React.useState(false);
  const [showRegisterEmployeeModal, setShowRegisterEmployeeModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [onError, setOnError] = React.useState(undefined);

  const attemptFetching = async () => {
    setLoading(true);
    try {
      let user = await get('/user/me');
      setUser(user);
    } catch(e) {
      console.error(e);
      setOnError(e.message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    attemptFetching();
  }, []);

  return (<>
    <Header/>
    <div style={{ 
      display: 'flex', 
      height: '100%', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'white'
    }}>
      {
        loading ?
        <Spinner
          animation="border" 
          role="status" 
          style={{ margin: '10%' }}>
          <span className="sr-only">Loading...</span>
        </Spinner> :
        user ?
        <Container style={{
          width: '100%',
          height: '100%',
          padding: '120px'
        }}>
          <Card.Body>
            <Row>
              <h1 style={{
                textAlign: 'start',
                textDecoration: 'underline',
                flex: 1
              }}>
                My Profile
              </h1>
              <div style={{
                flex: 1,
                textAlign: 'end'
              }}>
                <Button
                  style={{ margin: 5 }}
                  label='Update Password'
                  onClick={() => setShowUpdatePasswordModal(true)}/>
                <UpdatePasswordModal 
                  show={showUpdatePasswordModal}
                  handleClose={() => setShowUpdatePasswordModal(false)} 
                  user={user}/>
                {
                  user?.type === 'admin' ?
                  <>
                    <Button
                      style={{ margin: 5 }}
                      label='Register Employee'
                      onClick={() => setShowRegisterEmployeeModal(true)}/>
                    <RegisterEmployeeModal 
                      show={showRegisterEmployeeModal}
                      handleClose={() => setShowRegisterEmployeeModal(false)}/>
                  </> :
                  <></>
                }
              </div>
            </Row>
            <Row>
              <Col style={{
                margin: '50px',
                flex: 1
              }}>{profileIcon}</Col>
              <Col style={{
                marginInlineStart: '50px',
                flex: 4
              }}>
                <Row style={{ padding: '10px' }}>
                  <h5 className='text-box-profile'>Name</h5>
                  <h5 className='text-box-profile-values'>{user.name}</h5>
                </Row>
                <Row style={{ padding: '10px' }}>
                  <h5 className='text-box-profile'>Phone</h5>
                  <h5 className='text-box-profile-values'>{user.phone}</h5>
                </Row>
                <Row style={{ padding: '10px' }}>
                  <h5 className='text-box-profile'>Email</h5>
                  <h5 className='text-box-profile-values'>{user.email}</h5>
                </Row>
                <Row style={{ padding: '10px' }}>
                  <h5 className='text-box-profile'>Age</h5>
                  <h5 className='text-box-profile-values'>{user.age}</h5>
                </Row>
                <Row style={{ padding: '10px' }}>
                  <h5 className='text-box-profile'>Member since</h5>
                  <h5 className='text-box-profile-values'>{new Date(user.registerDate).toLocaleDateString()}</h5>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Container> :
        <div onClick={attemptFetching} style={{ fontSize: 20, cursor: 'pointer' }}>
          <div>{refreshIcon}</div>
          <div>Click to retry</div>
        </div>
      }
      </div>
      <Alert onError={onError} setOnError={setOnError}/>
  </>);
}

const UpdatePasswordModal = (props) => {
  const [password, setPassword] = React.useState('');
  const [valid, setValid] = React.useState('');

  const updatePassword = async () => {
    if (password.length < 8) {
      setValid('Too short');
      return;
    }
    try {
      let result = await post('/user/updatePassword', {
        id: props.user.id,
        password: password
      });
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Modal 
      centered
      show={props.show} 
      size='sm' 
      onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Enter new password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            name='password'
            value={password}
            placeholder='Enter new Password'
            type='password'
            onChange={(e) => {
              e.preventDefault();
              setValid('');
              setPassword(e.target.value);
            }}
          />
          <div style={{ color: 'red', textAlign: 'start' }}>
            {valid}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={updatePassword}
          label='Submit'
        />
      </Modal.Footer>
    </Modal>
  );
}

const RegisterEmployeeModal = (props) => {
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
    validationSchema: RegisterEmployeeSchema,
    onSubmit: async (values) => {
      console.log('Registering....');
      try {
        delete (values.cpassword);
        let result = await post('/user/register', 
          values, {
            withAuth: false
          });
        console.log(result);
      } catch (e) {
        console.error(e);
      }
    }
  });

  return (
  <Modal 
    show={props.show}
    onHide={props.handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Enter details of Employee</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        {
          [{ place: 'Name',            name: 'name',      type: 'text' },
          { place: 'Type',             name: 'type',      type: 'select', 
            options: ['customer', 'supervisor', 'technician', 'admin']},
          { place: 'Age',              name: 'age',       type: 'number' },
          { place: 'Phone',            name: 'phone',     type: 'number' },
          { place: 'Email',            name: 'email',     type: 'text' },
          { place: 'Password',         name: 'password',  type: 'password' },
          { place: 'Confirm Password', name: 'cpassword', type: 'password' }]
          .map((value, index) => {
            if (value.name !== 'type')
              return (<div key={index}>
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
            </div>);
            else
              return (<div key={index}>
                <Form.Control style={{ marginTop: 20 }}
                  as={value.type}
                  name={value.name}
                  value={formik.values[value.name]}
                  placeholder={value.place}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                >
                {
                  value.options.map((option, index) => 
                  <option value={option} key={index}>
                    {option.toUpperCase()}
                  </option>)
                }
                </Form.Control>
                <div style={{ color: 'red', textAlign: 'start' }}>
                {
                  formik.touched[value.name] ?
                  formik.errors[value.name] : ''
                }
                </div>
            </div>);
          })
        }
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button 
        onClick={formik.handleSubmit}
        label='Register'/>
    </Modal.Footer>
  </Modal>)
}
