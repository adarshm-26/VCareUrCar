import React from 'react';
import { Header, Alert, Button, refreshIcon } from './Components';
import { Spinner, Card, Container, Row, Col, Table, Form, ListGroup } from 'react-bootstrap';
import { get, post } from '../Utils';
import { useHistory } from 'react-router-dom';

export const Verify = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [technician, setTechnician] = React.useState(undefined);
  const [car, setCar] = React.useState(undefined);
  const [verifiedServices, setVerfiedServices] = React.useState([]);
  const [onError, setOnError] = React.useState('');
  const history = useHistory();

  const attemptFetching = async () => {
    setLoading(true);
    try {
      let carRes = await get(`/cars/${props.location.state.job.carId}`);
      setCar(carRes);
      let techRes = await get(`/user/${props.location.state.job.technicianId}`);
      setTechnician(techRes);
    } catch (e) {
      console.error(e);
      setOnError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const stableFetching = React.useCallback(attemptFetching, []);

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
        props.location?.state?.job ?
        technician && car ?
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
                }}>Verify Job</h1>
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
                    <td>{new Date(props.location.state.job.bookingDate).toDateString()}</td>
                  </tr>
                  <tr>
                    <th>Car</th>
                    <td>{car.model}({car.brand})</td>
                  </tr>
                  <tr>
                    <th>Deadline Date</th>
                    <td>{new Date(props.location.state.job.deadlineDate).toDateString()}</td>
                  </tr>
                  <tr>
                    <th>Technician</th>
                    <td>{technician.name}</td>
                  </tr>
                </tbody>
              </Table>
              <h4>Services : </h4>
              <ListGroup  style={{ textAlign: 'start' }}>
              {
                props.location.state.job?.services?.map((service, index) => 
                <ListGroup.Item key={index}>
                  <Row>
                    <Col sm='7'>
                      <p>{service.name}</p>
                      <div>Worked On : {service.work}</div>
                      <div>Cost : {service.cost}</div>
                      <div>
                        Completed On : 
                        {new Date(service.completedDate).toDateString()}
                      </div>
                    </Col>
                    <Col sm='3'>
                    <Form.Check
                      type='checkbox'
                      name={index}
                      label='Verify'
                      onChange={(e) => {
                        let services = [...verifiedServices];
                        console.log(e.target.value);
                        services[e.target.name] = !services[e.target.name];
                        setVerfiedServices(services);
                      }}
                    />
                    </Col>
                  </Row>
                </ListGroup.Item>)
              }
              </ListGroup>
            </div>
            <Button
              label='Submit'
              onClick={async () => {
                try {
                  console.log(JSON.stringify(verifiedServices));
                  let body = props.location.state.job;
                  let todayDate = new Date().getTime();
                  for (let key in verifiedServices) {
                    if (verifiedServices[key])
                      body.services[key].verifiedDate = todayDate;
                  }
                  await post('/jobs/verify', body, { getResult: false });
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