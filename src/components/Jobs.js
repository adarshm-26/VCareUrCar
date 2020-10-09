import React from 'react';
import { Card, Spinner, Modal, Container, ListGroup, Badge, Table, Row } from 'react-bootstrap';
import { Header, Alert, Button, BookingModal, refreshIcon } from './Components';
import { get, post } from '../Utils';
import { useHistory } from 'react-router-dom';

const statusToBadgeColorMap = {
  'BOOKED': 'info',
  'SCHEDULED': 'info',
  'UNDER_SERVICE': 'warning',
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
      if (userRes.type === 'supervisor') {
        let newJobsRes = await get('/jobs/byStatus/BOOKED');
        let all = [];
        all.push(...newJobsRes.content);
        all.push(...jobsRes.content);
        setJobs(all);
      }
      else {
        setJobs(jobsRes.content);
      }
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
                  user.type === 'customer' || user.type === 'admin' ?
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
                  ) : <p>
                    No jobs found, contact Administrator<br/>
                    if you think this is a mistake
                  </p>
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
      props.status === 'BOOKED' ?
      <div style={{ flex: 2}}>
        Pending acknowledgement from Supervisor
      </div> :
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
  const history = useHistory();
  const [action, setAction] = React.useState({
    label: '',
    onClick: () => {}
  });

  const schedule = () => {
    history.push({
      pathname: '/schedule',
      state: {
        job: props.content,
        user: props.user,
      }
    });
  }
  
  const logService = async () => {
    history.push({
      pathname: '/logService',
      state: {
        job: props.content,
        user: props.user,
      }
    });
  }
  
  const verify = async () => {
    history.push({
      pathname: '/verify',
      state: {
        job: props.content,
        user: props.user,
      }
    });
  }

  const stableSchedule = React.useCallback(schedule, 
    [props.content, props.user]);
  const stableVerify = React.useCallback(verify, 
    [props.content, props.user]);
  const stableLogService = React.useCallback(logService, 
    [props.content, props.user]);

  React.useEffect(() => {
    const actionBuilder = async () => {
      try {
        if (props.content.status === 'BOOKED' &&
        (props.user.type === 'admin' || 
        props.user.type === 'supervisor')) {
          setAction({
            label: 'Schedule',
            onClick: stableSchedule
          });
        }
        else if ((props.content.status === 'SCHEDULED' || 
        props.content.status === 'UNDER_SERVICE') &&
        (props.user.type === 'admin' || 
        props.user.type === 'technician')) {
          setAction({
            label: 'Log Services',
            onClick: stableLogService
          });
        }
        else if (props.content.status === 'UNDER_SERVICE' &&
        (props.user.type === 'admin' || 
        props.user.type === 'supervisor')) {
          setAction({
            label: 'Verify Services',
            onClick: stableVerify
          })
        }
      } catch (e) {
        console.error(e);
      }
    }
    actionBuilder();
  }, [props.user.type, 
    props.content.status,
    stableSchedule,
    stableVerify,
    stableLogService]);

  return (
  <Modal 
    show={props.show} 
    onHide={props.handleClose} 
    size='lg'>
    <Modal.Header>
      <Modal.Title 
        style={{ fontFamily: 'Sansita' }}>
        Job Specifics
      </Modal.Title>
      {
        action.label !== '' ?
        <div style={{ marginLeft: 'auto', marginRight: 0 }}>
          <Button 
            onClick={action.onClick} 
            label={action.label}/>
        </div> : 
        <></>
      }
    </Modal.Header>
    <Modal.Body style={{ maxHeight: '25rem', overflow: 'scroll' }}>
      <Table hover>
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
      <h5>Services :</h5>
      <ListGroup variant='flush'>
        {
          props.content?.services?.map((service, index) => 
          <Row key={index}>
          {
            typeof service === 'object' ? 
            Object.keys(service).map((key, index) => 
              service[key] ? 
              <div style={{ marginLeft: 20 }} key={index}>
                {service[key]}
              </div> : <></>
            ) : <></>
          } 
          </Row>)
        }
      </ListGroup>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={props.handleClose} label='Ok'/>
    </Modal.Footer>
  </Modal>);
}
