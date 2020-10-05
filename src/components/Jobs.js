import React from 'react';
import { Card, Spinner, Modal, Container, ListGroup, Badge, Table, Row } from 'react-bootstrap';
import { Header, Alert, Button, BookingModal } from './Components';
import { get } from '../Utils';

const refreshIcon = <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 14.5C3.63401 14.5 0.5 11.366 0.5 7.5C0.5 5.26904 1.54367 3.28183 3.1694 2M7.5 0.5C11.366 0.5 14.5 3.63401 14.5 7.5C14.5 9.73096 13.4563 11.7182 11.8306 13M11.5 10V13.5H15M0 1.5H3.5V5" stroke="black"/>
</svg>;

const statusToBadgeColorMap = {
  'BOOKED': 'info',
  'SCHEDULED': 'info',
  'UNDER_SERVICE': 'warning',
  'AWAITING_VERIFICATION': 'danger',
  'VERIFIED': 'info',
  'COMPLETED': 'success'
}

export const Jobs = () => {
  const [jobs, setJobs] = React.useState('');
  const [user, setUser] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showBookingModal, setShowBookingModal] = React.useState(false);
  const [modalContent, setModalContent] = React.useState('');
  const [onError, setOnError] = React.useState(undefined);

  const attemptFetching = async () => {
    setLoading(true);
    try {
      let userRes = await get('/user/me');
      setUser(userRes);
      let jobsRes = await get('/jobs/byUser/my');
      setJobs(jobsRes);
    }
    catch (e) {
      console.error(e);
      setOnError(e.message);
    }
    finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    attemptFetching();
  }, []);

  const triggerShowModal = (job) => {
    setModalContent(job);
    setShowModal(true);
  }

  const hideModal = () => setShowModal(false);

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
        jobs ?
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
                }}>My Jobs</h1>
                {
                  user.type === 'customer' ?
                  <div style={{ flex: 2, textAlign: 'end' }}>
                    <Button
                      onClick={() => setShowBookingModal(true)}
                      label='Book'
                    />
                  </div> : <></>
                }
              </Row>
              <BookingModal 
                show={showBookingModal} 
                handleClose={() => setShowBookingModal(false)} 
                user={user}/>
              <JobDetailsModal 
                handleClose={hideModal} 
                show={showModal} 
                content={modalContent}
                user={user}/>
              <ListGroup style={{ marginTop: 20 }}>
                {
                  typeof jobs === 'object' && jobs.length > 0 ? 
                  jobs.map((job, index) => 
                    <ListGroup.Item 
                      key={index} 
                      action
                      onClick={() => triggerShowModal(job)}>
                      <JobDetailsLayout {...job}/>
                    </ListGroup.Item>
                  ) : <p>No jobs found</p>
                }
              </ListGroup>
            </div>
          </Card.Body>
        </Container> :
        <div 
          onClick={attemptFetching} 
          style={{ fontSize: 20, cursor: 'pointer' }}>
          <div>{refreshIcon}</div>
          <div>Click to retry</div>
        </div>
      }
      </div>
      <Alert onError={onError} setOnError={setOnError}/>
  </>);
}

const JobDetailsLayout = (props) => {
  return <Row key={props.id}>
    <div style={{ flex: 1 }}>
      <Badge
      style={{ fontSize: 16, fontFamily: 'monospace' }}
      variant={statusToBadgeColorMap[props.status]}>
        {props.status}
      </Badge>
    </div>
    <div style={{ flex: 2 }}>
      Booked on {new Date(props.bookingDate).toDateString()}
    </div>
    {
      props.status !== 'VERIFIED' || props.status !== 'COMPLETED' ?
      <div style={{ flex: 2 }}>
        Should be over by {new Date(props.deadlineDate).toDateString()}
      </div> :
      <div style={{ flex: 2 }}>
        JobID for reference {props.id}
      </div>
    }
  </Row>
}

const JobDetailsModal = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [technicians, setTechnicians] = React.useState(undefined);
  const [selectedTech, setSelectedTech] = React.useState('');
  const [deadline, setDeadline] = React.useState('');
  const [serviceLog, setServiceLog] = React.useState('');

  const handleSchedule = async () => {
    
  }

  const attemptFetch = async () => {
    setLoading(true);
    try {
      let result = await get('/user/all')
      setTechnicians(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (props.content.status === 'BOOKED' &&
    (props.user.type === 'admin' || props.user.type === 'supervisor')) {
      attemptFetch();
    }
  }, [props.user.type, props.content.status]);

  return (
  <Modal show={props.show} onHide={props.handleClose} size='lg'>
    <Modal.Header closeButton>
      <Modal.Title style={{ fontFamily: 'Sansita' }}>Job Specifics</Modal.Title>
    </Modal.Header>
    <Modal.Body style={{ maxHeight: '25rem', overflow: 'scroll' }}>
      <Table striped hover responsive>
        <tbody>
        {
          typeof props.content === 'object' ? 
          Object.keys(props.content).map((key, index) => 
            key !== 'services' && props.content[key] ? 
            <tr key={index}>
              <th>{key}</th>
              <td>{props.content[key]}</td>
            </tr> : <></>
          ) : <></>
        }
        </tbody>
      </Table>
      <Table striped hover responsive>
        <tbody>
        {
          props.content?.services?.map((service, index) => 
          <tr style={{ flexDirection: 'row' }} key={index}>
          {
            typeof service === 'object' ? 
            Object.keys(service).map((key, index) => 
              service[key] ? 
              <td key={index}>
                {service[key]}
              </td> : <></>
            ) : <></>
          } 
          </tr>)
        }
        </tbody>
      </Table>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={props.handleClose} label='Ok'/>
      { 
        props.content?.status === 'BOOKED' && 
        (props.user?.type === 'admin' || props.user?.type === 'supervisor') ? 
        <Button onClick={handleSchedule} label='Schedule'/> : <></> 
      }
    </Modal.Footer>
  </Modal>);
}
