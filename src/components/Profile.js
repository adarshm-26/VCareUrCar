import React, { useEffect, useState } from 'react';
import { Card, Spinner, Button } from 'react-bootstrap';
import { useAuth } from '../context/auth';

export const Profile = () => {
  const [user, setUser] = useState('');
  const { token, signOut } = useAuth();

  useEffect(() => {
    fetchUserDetails(token)
    .then(userDetails => setUser(userDetails))
    .catch(e => console.error(e));
  }, [token]);

  return (<>
    <div style={{ justifyContent: 'center', alignItems: 'center' }}>
      {
        user ?
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner> :
        <Card>
          <Card.Body>
            <p>Name : {user.name}</p>
            <p>Email : {user.email}</p>
            <p>Phone : {user.phone}</p>
            <Button onClick={signOut}>Sign Out</Button>
          </Card.Body>
        </Card>
      }
    </div>
  </>);
}

const fetchUserDetails = async (token) => {
  try {
    let response = await fetch({
      method: 'GET',
      url: 'http://localhost:1112/user/me',
      headers: {
        'Authentication': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    let userDetails = await response.json();
    return userDetails;
  } catch (e) {
    console.error(e);
  }
}