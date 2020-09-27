import React from 'react';
import { Card, Spinner, Row, Col } from 'react-bootstrap';
import { Header, Alert } from './Components';

const icon = <svg width="100%" height="100%" viewBox="0 0 16 16" className="bi bi-person-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z"/>
  <path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
  <path fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/>
</svg>;

export const Profile = () => {
  const [user, setUser] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [onError, setOnError] = React.useState(undefined);

  if (!loading && !onError && !user) {
    setLoading(true);
    fetchUserDetails()
    .then(user => {
      setUser(user);
    })
    .catch(e => {
      console.error(e);
      setOnError(e.message);
    })
    .finally(() => {
      setLoading(false);
    })
  }

  return (<>
    <Header/>
    <div style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div>
      {
        !user ?
        <Spinner 
          animation="border" 
          role="status" 
          style={{ margin: '10%' }}>
          <span className="sr-only">Loading...</span>
        </Spinner> :
        <Card style={{
          width: '75%', 
          margin: 'auto', 
          marginTop: '40px',
          border: '1px solid #000000'
        }}>
          <Card.Body>
            <div>
              <h1 style={{
                textAlign: 'start',
                textDecoration: 'underline'
              }}>My Profile</h1>
              <Row>
                <Col style={{
                  margin: '50px',
                  flex: 1
                }}>{icon}</Col>
                <Col style={{
                  marginInlineStart: '50px',
                  flex: 4
                }}>
                  <Row style={{ padding: '10px' }}>
                    <h3 style={{ flex: 1, textAlign: 'start' }}>Name</h3>
                    <h3 style={{ flex: 1, textAlign: 'start' }}>{user.name}</h3>
                  </Row>
                  <Row style={{ padding: '10px' }}>
                    <h3 style={{ flex: 1, textAlign: 'start' }}>Phone</h3>
                    <h3 style={{ flex: 1, textAlign: 'start' }}>{user.phone}</h3>
                  </Row>
                  <Row style={{ padding: '10px' }}>
                    <h3 style={{ flex: 1, textAlign: 'start' }}>Email</h3>
                    <h3 style={{ flex: 1, textAlign: 'start' }}>{user.email}</h3>
                  </Row>
                  <Row style={{ padding: '10px' }}>
                    <h3 style={{ flex: 1, textAlign: 'start' }}>Age</h3>
                    <h3 style={{ flex: 1, textAlign: 'start' }}>{user.age}</h3>
                  </Row>
                  <Row style={{ padding: '10px' }}>
                    <h3 style={{ flex: 1, textAlign: 'start' }}>Member since</h3>
                    <h3 style={{ flex: 1, textAlign: 'start' }}>{user.registeredOn}</h3>
                  </Row>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      }
      </div>
      <Alert onError={onError} setOnError={setOnError}/>
    </div>
  </>);
}

const fetchUserDetails = async () => {
  const token = localStorage.getItem('token');
  let response = await fetch('http://localhost:1112/user/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'cache': 'no-cache'
    }
  });
  let userDetails = await response.json();
  return userDetails;
}

const fetchUserCars = async () => {
  const token = localStorage.getItem('token');
  let response = await fetch('http://localhost:1112/cars/byUser/my', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'cache': 'no-cache'
    }
  });
  let carDetails = await response.json();
  return carDetails;
}

const fetchUserJobs = async () => {
  const token = localStorage.getItem('token');
  let response = await fetch('http://localhost:1112/jobs/byUser/my', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'cache': 'no-cache'
    }
  });
  let jobDetails = await response.json();
  return jobDetails;
}