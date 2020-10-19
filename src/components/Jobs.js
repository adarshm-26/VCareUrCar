import React from 'react';
import { 
  Card, 
  Spinner, 
  Container, 
  ListGroup, 
  Badge, 
  Row, 
  Tabs, 
  Tab } from 'react-bootstrap';
import { 
  Header, 
  Alert, 
  Button, 
  BookingModal, 
  JobDetailsModal,
  Footer, 
  refreshIcon } from './Components';
import { get } from '../Utils';
import { Paginate } from './Paginate';

const statusToBadgeColorMap = {
  'BOOKED': 'info',
  'SCHEDULED': 'info',
  'UNDER_SERVICE': 'warning',
  'VERIFIED': 'info',
  'COMPLETED': 'success'
}

export const Jobs = () => {
  const [jobs, setJobs] = React.useState('');
  const [newJobs, setNewJobs] = React.useState('');
  const [user, setUser] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showBookingModal, setShowBookingModal] = React.useState(false);
  const [modalContent, setModalContent] = React.useState('');
  const [onError, setOnError] = React.useState(undefined);
  const [jobTabPage, setJobTabPage] = React.useState(0);
  const [newJobTabPage, setNewJobTabPage] = React.useState(0);

  const attemptFetching = async () => {
    setLoading(true);
    try {
      let userRes = await get('/user/me');
      setUser(userRes);
      let jobsRes = await get(`/jobs/byUser/my?page=${jobTabPage}`);
      setJobs(jobsRes);
      if (userRes.type === 'supervisor') {
        let newJobsRes = await get(`/jobs/byStatus/BOOKED?page=${newJobTabPage}`);
        setNewJobs(newJobsRes);
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

  const stableAttemptFetching = React.useCallback(attemptFetching, 
    [jobTabPage, newJobTabPage]);

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
        (user.type === 'supervisor' ?
        jobs && newJobs : jobs) ?
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
              {
                user.type === 'supervisor' ?
                <Tabs
                  style={{ fontFamily: 'Source' }}
                  defaultActiveKey='my' 
                  id='tabs'>
                  <Tab 
                    eventKey='my' 
                    title='Supervised'>
                  {
                    typeof jobs === 'object' && 
                    jobs.content?.length > 0 ? 
                    jobs.content.map((job, index) => 
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
                  <Paginate
                    content={jobs}
                    pageNo={jobTabPage}
                    setPage={setJobTabPage}
                    callback={stableAttemptFetching}/>
                  </Tab>
                  <Tab eventKey='new' title='New'>
                  {
                    typeof newJobs === 'object' && 
                    newJobs.content?.length > 0 ? 
                    newJobs.content.map((job, index) => 
                      <ListGroup.Item 
                        key={index} 
                        action
                        onClick={() => triggerShowModal(job)}>
                        <JobDetailsLayout {...job}/>
                      </ListGroup.Item>
                    ) : <p>
                      No new jobs found
                    </p>
                  }
                  <Paginate
                    content={newJobs}
                    pageNo={newJobTabPage}
                    setPage={setNewJobTabPage}
                    callback={stableAttemptFetching}/>
                  </Tab>
                </Tabs> :
                <ListGroup style={{ marginTop: 20, fontFamily: 'Source' }}>
                  {
                    typeof jobs === 'object' && 
                    jobs.content?.length > 0 ? 
                    jobs.content.map((job, index) => 
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
                  <Paginate
                    content={jobs}
                    pageNo={jobTabPage}
                    setPage={setJobTabPage}
                    callback={stableAttemptFetching}/>
                </ListGroup>
              }
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
      <Footer/>
  </>);
}

const JobDetailsLayout = (props) => {
  return <Row key={props.id}>
    <div style={{ flex: 1 }}>
      <Badge
      style={{ fontSize: 16 }}
      variant={statusToBadgeColorMap[props.status]}>
        {props.status}
      </Badge>
    </div>
    <div style={{ flex: 2 }}>
      Booked on {new Date(props.bookingDate).toDateString()}
    </div>
    {
      props.status !== 'VERIFIED' && props.status !== 'COMPLETED' ?
      props.status === 'BOOKED' ?
      <div style={{ flex: 2}}>
        Pending acknowledgement from Supervisor
      </div> :
      <div style={{ flex: 2 }}>
        Should be over by {new Date(props.deadlineDate).toLocaleDateString()}
      </div> :
      <div style={{ flex: 2 }}>
        JobID for reference {props.id}
      </div>
    }
  </Row>
}
