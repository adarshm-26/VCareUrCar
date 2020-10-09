import React from 'react';
import { Card, Spinner, Modal, Container, Row, Button, Col } from 'react-bootstrap';
import { Header, Alert, BookingModal, refreshIcon } from './Components';
import { get, post } from '../Utils';
import { useHistory } from 'react-router-dom';

const currency = <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.99999 1V0H13V1H8.32866C9.22627 1.72635 9.83888 2.791 9.97253 4H13V5H9.97253C9.72381 7.24998 7.81627 9 5.49999 9H3.85162L9.82539 14.1204L9.1746 14.8796L2.1746 8.87963C2.01573 8.74346 1.95846 8.52277 2.03105 8.32653C2.10365 8.13029 2.29076 8 2.49999 8H5.49999C7.26323 8 8.72193 6.69615 8.96455 5H1.99999V4H8.96455C8.72193 2.30385 7.26323 1 5.49999 1H1.99999Z" fill="black" />
</svg>

const bascket = <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0.5 0.5L1.1 2.5M1.1 2.5L3.5 10.5H14.5V4.5C14.5 3.39543 13.6046 2.5 12.5 2.5H1.1ZM12.5 14.5C11.9477 14.5 11.5 14.0523 11.5 13.5C11.5 12.9477 11.9477 12.5 12.5 12.5C13.0523 12.5 13.5 12.9477 13.5 13.5C13.5 14.0523 13.0523 14.5 12.5 14.5ZM4.5 13.5C4.5 12.9477 4.94772 12.5 5.5 12.5C6.05228 12.5 6.5 12.9477 6.5 13.5C6.5 14.0523 6.05228 14.5 5.5 14.5C4.94772 14.5 4.5 14.0523 4.5 13.5Z" stroke="black" />
</svg>



export const Payment = () => {
  const [jobs, setJobs] = React.useState('');
  const [user, setUser] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  let discount = 500;
  let total = 5000;

  const [onError, setOnError] = React.useState(undefined);

  const attemptFetching = async () => {
    setLoading(true);
    try {
      let userRes = await get('/user/me');
      setUser(userRes);
      let jobsRes = await get('/jobs/byUser/my');
      setJobs(jobsRes.content);
    }
    catch (e) {
      console.error(e);
      setOnError(e.message);
    }
    finally {
      setLoading(false);
    }
  }

  const stableAttemptFetching = React.useCallback(attemptFetching, []);

  React.useEffect(() => {
    stableAttemptFetching();
  }, [stableAttemptFetching]);
  return <div style={{
    display: 'flex',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <Header />
    {
      loading ?
        <Spinner
          animation="border"
          role="status"
          style={{ margin: '10%' }}>
          <span className="sr-only">Loading...</span>
        </Spinner> :
        user ?
          <Card style={{ width: '30rem' }} className="text-center">
            <Card.Body>


              <Row>
                <Card.Header as="h5">Review Amount</Card.Header>
              </Row>
              <Row>
                <Col sm={8}>Amount </Col>
                <Col sm={3}> {total} </Col>
                <Col sm={1}>  {currency}</Col>
              </Row>
              <Row>
                <Col sm={8}>discount</Col>
                <Col sm={3}> {discount}</Col>
                <Col sm={1}>  {currency}</Col>
              </Row>
              <Row>
                <Col sm={8}>Total</Col>
                <Col sm={3}>{total - discount}</Col>
                <Col sm={1}>  {currency}</Col>
              </Row>
              <Row style={{ height: '30px' }}></Row>
              <Row>
                <Col xs={2}></Col>
                <Col >{bascket}</Col>
                <Col >
                  <Button onClick={async (e) => {
                    try {
                      await post('/payment/pgredirect', {
                        CUST_ID: user.id,
                        TXN_AMOUNT: (total - discount)

                      }, { getResult: false });

                    } catch (e) {
                      console.error(e);
                      setOnError(e.message);
                    }
                  }
                  } >pay amount</Button>
                </Col>
              </Row>

            </Card.Body>
          </Card> : <div
            onClick={attemptFetching}
            style={{ fontSize: 20, cursor: 'pointer' }}>
            <div>{refreshIcon}</div>
            <div>Click to retry</div>
          </div>
    }
  </div>
}