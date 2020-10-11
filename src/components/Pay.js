import React from 'react';
import { Header, Alert, Button, refreshIcon } from './Components';
import { Spinner, Card, Container, Row, Table, ListGroup } from 'react-bootstrap';
import { get, post } from '../Utils';
import { useHistory } from 'react-router-dom';

const addRazorpay = async (paymentDetails) => {
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  const options = {
    key: "rzp_test_qO4Lpyz964OqSr",
    amount: paymentDetails.amount,
    currency: "INR",
    name: "VCareUrCar",
    description: "Test Transaction",
    order_id: paymentDetails.order_id,
    handler: async response => {
      try {
        let verificationResult = await post('/jobs/pay/verify', {
          receipt: paymentDetails.receipt,
          ...response
        });
        if (verificationResult === true) {
          alert('Payment successfully verified');
        } else {
          alert('Payment could not be verified');
        }
      } catch (e) {
        console.error(e);
      }
    },
    prefill: {
      name: paymentDetails.name,
      email: paymentDetails.email,
      contact: paymentDetails.phone
    },
    notes: {
      address: "Razorpay Corporate Office"
    },
    theme: {
      color: "#D9F8FF"
    }
  };
  script.onload = () => {
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };
  script.onerror = () => {
    console.log('error loading script');
  };
  document.body.appendChild(script);
}

export const Pay = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [car, setCar] = React.useState(undefined);
  const [onError, setOnError] = React.useState('');
  const history = useHistory();

  const attemptFetching = async () => {
    setLoading(true);
    try {
      let carRes = await get(`/cars/${props.location.state.job.carId}`);
      setCar(carRes);
    } catch (e) {
      console.error(e);
      setOnError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const stableFetching = React.useCallback(attemptFetching, 
    [props.location.state.job.carId,
      props.location.state.job.technicianId]);

  React.useEffect(() => {
    stableFetching();
  }, [stableFetching]);

  return (
    <>
    <Header/>
    <div style={{ 
      display: 'flex', 
      height: '100%', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'white',
      overflow: 'auto'
    }}>
      {
        loading ?
        <Spinner 
          animation="border" 
          role="status" 
          style={{ margin: '10%' }}>
          <span className="sr-only">Loading...</span>
        </Spinner> :
        props.location?.state?.job ?
        car ?
        <Container style={{
          width: '100%',
          height: '100%',
          padding: '120px',
        }}>
          <Card.Body>
            <div>
              <Row style={{ alignItems: 'center' }}>
                <h1 style={{
                  flex: 1,
                  textAlign: 'start',
                  textDecoration: 'underline'
                }}>Pay Job</h1>
              </Row>
              <Table borderless>
                <tbody>
                  {['id', 'status'].map((key, index) =>
                  <tr>
                    <th>{key.toUpperCase()}</th>
                    <td>{props.location.state.job[key]}</td>   
                  </tr>)}
                  <tr>
                    <th>Booking Date</th>
                    <td>{new Date(props.location.state.job.bookingDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <th>Car</th>
                    <td>{car.model}({car.brand})</td>
                  </tr>
                  <tr>
                    <th>Deadline Date</th>
                    <td>{new Date(props.location.state.job.deadlineDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <th>Technician</th>
                    <td>{props.location.state.job.technicianId}</td>
                  </tr>
                </tbody>
              </Table>
              <h4>Services : </h4>
              <ListGroup  style={{ textAlign: 'start' }}>
              {
                props.location.state.job?.services?.map((service, index) => 
                <ListGroup.Item key={index}>
                  <Row>
                    <p>{service.name}</p>
                    <div>Worked On : {service.work}</div>
                    <div>Cost : {service.cost}</div>
                    <div>
                      Completed On : 
                      {new Date(service.completedDate).toLocaleDateString()}
                    </div>
                    <div>
                      Verified On :
                      {new Date(service.verifiedDate).toLocaleDateString()}
                    </div>
                  </Row>
                </ListGroup.Item>)
              }
              </ListGroup>
            </div>
            <Button
              style={{ marginTop: 20 }}
              label='Start Payment'
              onClick={async () => {
                try {
                  let total = 0;
                  props.location.state.job.services.forEach(service => {
                    total += (+service.cost * 100);
                  });
                  let body = {
                    amount: total,
                    currency: 'INR',
                    receipt: props.location.state.job.id
                  }
                  let result = await post('/jobs/pay/initiate', body);
                  await addRazorpay({
                    name: props.location.state.user.name,
                    email: props.location.state.user.email,
                    phone: props.location.state.user.phone,
                    amount: total,
                    order_id: result.orderId,
                    receipt: props.location.state.job.id
                  });
                } catch (e) {
                  console.error(e);
                  setOnError(e.message);
                } finally {
                  history.replace('/jobs');
                }
              }}/>
          </Card.Body>
        </Container> :
        <div 
          onClick={attemptFetching} 
          style={{ fontSize: 20, cursor: 'pointer' }}>
          <div>{refreshIcon}</div>
          <div>Click to retry</div>
        </div> :
        <div>
          Do not refresh this page, Go to MyJobs and try again
        </div>
    }
    </div>
    <Alert onError={onError} setOnError={setOnError}/>
  </>
  );
}