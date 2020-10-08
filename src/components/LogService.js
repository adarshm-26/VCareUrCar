import React from 'react';
import { Header, Alert, Button, refreshIcon } from './Components';
import { Spinner, Card, Container, Row, Table, Form, ListGroup, Col } from 'react-bootstrap';
import { get, post } from '../Utils';
import { useHistory } from 'react-router-dom';

export const LogService = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [car, setCar] = React.useState(undefined);
  const [servicedServices, setServicedServices] = React.useState(props.location?.state?.job.services);
  const [onError, setOnError] = React.useState('');
  const history = useHistory();

  const attemptFetching = async () => {
    setLoading(true);
    try {
      let carRes = await get(`/cars/${props.location?.state?.job.carId}`);
      setCar(carRes);
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
                }}>Service Job</h1>
              </Row>
              <Table borderless>
                <tbody>
                  {['id', 'status'].map((key, index) =>
                  <tr key={index}>
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
                    <td>{props.location.state.job.technicianId}</td>
                  </tr>
                </tbody>
              </Table>
              <h4>Services : </h4>
              <ListGroup style={{ textAlign: 'start' }}>
              {
                props.location.state.job?.services?.map((service, index) => 
                <ListGroup.Item key={index}>
                  <p>{service.name}</p>
                  <Form.Group as={Row} key={`${index}-work`}>
                    <Form.Label column sm='3'>Work performed : </Form.Label>
                    <Col sm='7'>
                      <Form.Control 
                        name={service.name}
                        data-idx={index}
                        as='textarea'
                        rows='2'
                        value={servicedServices[index]?.work || ''}
                        readOnly={service.completedDate}
                        onChange={(e) => {
                          e.preventDefault();
                          let services = [...servicedServices];
                          services[e.target.dataset.idx].work = e.target.value;
                          setServicedServices(services);
                        }}/>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} key={`${index}-cost`}>
                    <Form.Label column sm='3'>Cost : </Form.Label>
                    <Col sm='7'>
                      <Form.Control
                        name={service.name}
                        data-idx={index}
                        type='number'
                        value={servicedServices[index]?.cost || ''}
                        readOnly={service.completedDate}
                        onChange={(e) => {
                          e.preventDefault();
                          let services = [...servicedServices];
                          services[e.target.dataset.idx].cost = e.target.value;
                          setServicedServices(services);
                        }}/>
                    </Col>
                  </Form.Group>
                </ListGroup.Item>)
              }
              </ListGroup>
            </div>
            <Button
              label='Submit'
              onClick={async () => {
                try {
                  let body = props.location.state.job;
                  body.services = servicedServices;
                  let todayDate = new Date().getTime();
                  for (let key in servicedServices) {
                    body.services[key].completedDate = todayDate;
                  }
                  body.appointedDate = todayDate;
                  await post('/jobs/service', body, { getResult: false });
                } catch (e) {
                  console.error(e);
                  setOnError(e.message);
                } finally {
                  history.push('/jobs');
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