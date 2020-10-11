import React from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Table } from 'react-bootstrap';
import { Button } from './Components'; 

export const JobDetailsModal = (props) => {
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

  const pay = async () => {
    history.push({
      pathname: '/pay',
      state: {
        job: props.content,
        user: props.user
      }
    });
  }

  const stableSchedule = React.useCallback(schedule, 
    [props.content, props.user]);
  const stableVerify = React.useCallback(verify, 
    [props.content, props.user]);
  const stableLogService = React.useCallback(logService, 
    [props.content, props.user]);
  const stablePay = React.useCallback(pay,
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
        else if (props.content.status === 'VERIFIED' &&
        (props.user.type === 'admin' ||
        props.user.type === 'customer')) {
          setAction({
            label: 'Make payment',
            onClick: stablePay
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
    stableLogService,
    stablePay]);

  return (
  <Modal 
    show={props.show} 
    onHide={props.handleClose} 
    size='lg'
    centered>
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
    <Modal.Body style={{ maxHeight: '25rem', overflow: 'auto' }}>
      <Table hover borderless>
        <tbody>
        {
          typeof props.content === 'object' ?
          [{ name: 'Job ID', value: props.content.id },
          { name: 'Car', value: props.content.carId },
          { name: 'Customer', value: props.content.customerId },
          { name: 'STATUS', value: props.content.status },
          { name: 'Booked On', value: new Date(props.content.bookingDate).toLocaleDateString() },
          { name: 'Accepted On', value: new Date(props.content.acceptedDate).toLocaleDateString() },
          { name: 'Servicing started', value: new Date(props.content.appointedDate).toLocaleDateString() },
          { name: 'Deadline', value: new Date(props.content.deadlineDate).toLocaleDateString() },
          { name: 'Supervisor', value: props.content.supervisorId },
          { name: 'Technician', value: props.content.technicianId }].map((key, index) => 
            <tr key={index}>
              <th>{key.name}</th>
              <td>{key.value}</td>
            </tr>
          ) : <></>
        }
        </tbody>
      </Table>
      <h5 style={{ marginLeft: 10 }}>Services :</h5>
      <Table hover borderless>
        <thead>
          <tr>
            {['Service', 'Cost', 'Completed On', 'Verfied On'].map((key, index) => 
              <th>{key}</th>
            )} 
          </tr>
        </thead>
        <tbody>
        {
          typeof props.content.services === 'object' ?
          props.content?.services?.map((service, index) => 
          <tr key={index}>
          {['name', 'cost'].map((key, index) => 
              service[key] ? 
              <td>{service[key]}</td> : <></>
            )}
          {['completedDate', 'verifiedDate'].map((key, index) => 
              service[key] ? 
              <td>{new Date(service[key]).toLocaleDateString()}</td> : <></>
            )}
          </tr>) : <></>
        }
        </tbody>
      </Table>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={props.handleClose} label='Ok'/>
    </Modal.Footer>
  </Modal>);
}
