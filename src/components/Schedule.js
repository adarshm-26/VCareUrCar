import React from 'react';
import { Header, Alert, Button, refreshIcon } from './Components';
import { Spinner, Card, Container, Row, Table, Form, ListGroup } from 'react-bootstrap';
import { get, post } from '../Utils';
import { useHistory } from 'react-router-dom';

export const Schedule = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [technicians, setTechnicians] = React.useState(undefined);
  const [car, setCar] = React.useState(undefined);
  const [selectedTech, setSelectedTech] = React.useState('');
  const [deadline, setDeadline] = React.useState(new Date().toISOString().split('T')[0]);
  const [onError, setOnError] = React.useState('');
  const history = useHistory();

  const attemptFetching = async () => {
    setLoading(true);
    try {
      let carRes = await get(`/cars/${props.location.state.job.carId}`);
      setCar(carRes);
      let techRes = await get('/user/all?type=technician');
      setTechnicians(techRes?.content);
      if (techRes.content.length > 0)
        setSelectedTech(0);
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
        technicians && car ?
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
                }}>Schedule Job</h1>
              </Row>
              <Table borderless style={{ textAlign: 'end' }}>
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
                    <td>
                      <Form.Control
                        name='deadlineDate'
                        type='date'
                        value={deadline}
                        onChange={(e) => {
                          console.log(e.target.value);
                          console.log(new Date(e.target.value).toISOString().split('T')[0]);
                          setDeadline(e.target.value);
                        }}/>
                    </td>
                  </tr>
                  <tr>
                    <th>Technician</th>
                    <td>
                      <Form.Control
                        as='select'
                        name='technician'
                        value={selectedTech}
                        onChange={(e) => {
                          e.preventDefault();
                          setSelectedTech(e.target.value);
                        }}>
                      {
                        typeof technicians === 'object' &&
                        technicians.length > 0 ?
                        technicians.map((tech, index) => 
                          <option value={index}>
                            {tech.name}
                          </option>
                        ) :
                        <option>No technician found</option>
                      }
                      </Form.Control>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <h4>Services : </h4>
              <ListGroup style={{ textAlign: 'start' }}>
              {
                props.location.state.job?.services?.map((service, index) => 
                <ListGroup.Item key={index}>
                  <p>{service.name}</p>
                </ListGroup.Item>)
              }
              </ListGroup>
            </div>
            <Button
              style={{ marginTop: 20 }}
              label='Submit'
              onClick={async () => {
                try {
                  console.log(selectedTech + " " + deadline);
                  let body = props.location.state.job;
                  body.deadlineDate = new Date(deadline).getTime();
                  body.technicianId = technicians[selectedTech].id;
                  body.acceptedDate = new Date().getTime();
                  body.supervisorId = props.location.state.user?.id;
                  body.status = "SCHEDULED";
                  await post('/jobs/schedule', body, { getResult: false });
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
