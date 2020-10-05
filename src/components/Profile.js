import React from 'react';
import { Card, Spinner, Row, Col, Container } from 'react-bootstrap';
import { Header, Alert } from './Components';
import { get } from '../Utils';

const profileIcon = <svg width="100%" height="100%" viewBox="0 0 16 16" className="bi bi-person-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z"/>
  <path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
  <path fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/>
</svg>;

const refreshIcon = <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 14.5C3.63401 14.5 0.5 11.366 0.5 7.5C0.5 5.26904 1.54367 3.28183 3.1694 2M7.5 0.5C11.366 0.5 14.5 3.63401 14.5 7.5C14.5 9.73096 13.4563 11.7182 11.8306 13M11.5 10V13.5H15M0 1.5H3.5V5" stroke="black"/>
</svg>;


export const Profile = () => {
  const [user, setUser] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [onError, setOnError] = React.useState(undefined);

  const attemptFetching = () => {
    setLoading(true);
    get('/user/me')
    .then(user => {
      setUser(user);
    })
    .catch(e => {
      console.error(e);
      setOnError(e.message);
    })
    .finally(() => {
      setLoading(false);
    });
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
            <div>
              <h1 style={{
                textAlign: 'start',
                textDecoration: 'underline'
              }}>My Profile</h1>
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
                    <h3 className='text-box-profile'>Name</h3>
                    <h3 className='text-box-profile-values'>{user.name}</h3>
                  </Row>
                  <Row style={{ padding: '10px' }}>
                    <h3 className='text-box-profile'>Phone</h3>
                    <h3 className='text-box-profile-values'>{user.phone}</h3>
                  </Row>
                  <Row style={{ padding: '10px' }}>
                    <h3 className='text-box-profile'>Email</h3>
                    <h3 className='text-box-profile-values'>{user.email}</h3>
                  </Row>
                  <Row style={{ padding: '10px' }}>
                    <h3 className='text-box-profile'>Age</h3>
                    <h3 className='text-box-profile-values'>{user.age}</h3>
                  </Row>
                  <Row style={{ padding: '10px' }}>
                    <h3 className='text-box-profile'>Member since</h3>
                    <h3 className='text-box-profile-values'>{user.registeredOn}</h3>
                  </Row>
                </Col>
              </Row>
            </div>
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
