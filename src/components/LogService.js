import React from 'react';
import { Header, Alert, Button, Footer, refreshIcon, ConfirmModal } from './Components';
import { Spinner, Card, Container, Row, Table, Form, ListGroup, Col } from 'react-bootstrap';
import { get, post } from '../Utils';
import { useHistory } from 'react-router-dom';

export const LogService = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [car, setCar] = React.useState(undefined);
  const [technician, setTechnician] = React.useState(undefined);
  const [servicedServices, setServicedServices] = React.useState([]);
  const [onError, setOnError] = React.useState('');
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [confirmModalContent, setConfirmModalContent] = React.useState('');
  const [confirmModalAction, setConfirmModalAction] = React.useState('');
  const history = useHistory();

  const handleClose = () => setShowConfirmModal(false);

  const attemptFetching = async () => {
    setLoading(true);
    try {
      let carRes = await get(`/cars/${props.location?.state?.job.carId}`);
      setCar(carRes);
      let techRes = await get(`/user/${props.location?.state?.job.technicianId}`);
      setTechnician(techRes.name);
    } catch (e) {
      console.error(e);
      setOnError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const stableFetching = React.useCallback(attemptFetching, [props.location?.state?.job.carId]);

  React.useEffect(() => {
    let services = [];
    props.location.state.job.services.forEach(service => {
      services.push({...service});
    });
    setServicedServices(services);
    stableFetching();
  }, [stableFetching, props.location.state.job.services]);

  return (
    <>
    <Header/>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'white',
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
          margin: '8rem auto',
          maxWidth: '60rem'
        }}>
          <Card.Body >
            <div>
              <Row style={{ alignItems: 'center' }}>
                <h1 style={{
                  flex: 1,
                  textAlign: 'start',
                  textDecoration: 'underline'
                }}>Service Job</h1>
              </Row>
              <Table borderless style={{ fontFamily: 'Source' }}>
                <tbody>
                  {['id', 'status'].map((key, index) =>
                  <tr key={index}>
                    <th style={{ textAlign: 'end' }}>{key.toUpperCase()}</th>
                    <td style={{ textAlign: 'start' }}>{props.location.state.job[key]}</td>   
                  </tr>)}
                  <tr>
                    <th style={{ textAlign: 'end' }}>Booking Date</th>
                    <td style={{ textAlign: 'start' }}>{new Date(props.location.state.job.bookingDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <th style={{ textAlign: 'end' }}>Car</th>
                    <td style={{ textAlign: 'start' }}>{car.model}({car.brand})</td>
                  </tr>
                  <tr>
                    <th style={{ textAlign: 'end' }}>Deadline Date</th>
                    <td style={{ textAlign: 'start' }}>{new Date(props.location.state.job.deadlineDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <th style={{ textAlign: 'end' }}>Technician</th>
                    <td style={{ textAlign: 'start' }}>{technician}</td>
                  </tr>
                </tbody>
              </Table>
              <h4 style={{
                textAlign: 'start',
                textDecoration: 'underline'
              }}>Services : </h4>
              <ListGroup style={{ textAlign: 'start', fontFamily: 'Source' }}>
              {
                servicedServices.map((service, index) => 
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
                        value={service.work || ''}
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
              style={{ marginTop: 20 }}
              label='Submit'
              onClick={(e) => {
                e.preventDefault();
                const action = async () => {
                  try {
                    let body = props.location.state.job;
                    let todayDate = new Date().getTime();
                    servicedServices.forEach((service, index) => {
                      if (body.services[index].cost !== service.cost) {
                        body.services[index] = service;
                        body.services[index].completedDate = todayDate;
                      }
                    });
                    body.appointedDate = todayDate;
                    await post('/jobs/service', body, { getResult: false });
                  } catch (e) {
                    console.error(e);
                    setOnError(e.message);
                  } finally {
                    history.push('/jobs');
                  }
                }
                const content = {};
                for (let key in servicedServices) {
                  if (props.location.state.job.services[key].work !==
                    servicedServices[key].work) {
                    content[key] = servicedServices[key];
                  }
                }
                setConfirmModalAction({
                  label: 'Log Services',
                  onClick: action
                });
                setConfirmModalContent(content);
                setShowConfirmModal(true);
              }}/>
              <ConfirmModal
                show={showConfirmModal}
                content={confirmModalContent}
                action={confirmModalAction}
                handleClose={handleClose}/>
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
    <Footer/>
  </>
  );
}