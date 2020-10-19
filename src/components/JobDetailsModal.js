import React from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Table, ButtonGroup } from 'react-bootstrap';
import { Button } from './Components'; 
import { get } from '../Utils';

export const JobDetailsModal = (props) => {
  const history = useHistory();
  const [technician, setTechnician] = React.useState('');
  const [supervisor, setSupervisor] = React.useState('');
  const [customer, setCustomer] = React.useState('');
  const [car, setCar] = React.useState('');
  const [action, setAction] = React.useState([]);

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
    let newActs = [];
    let user = props.user, content = props.content;
    if (content.status === 'BOOKED' &&
    (user.type === 'admin' || 
    user.type === 'supervisor')) {
      newActs.push({
        label: 'Schedule',
        onClick: stableSchedule
      });
    }
    if ((content.status === 'SCHEDULED' || 
    content.status === 'UNDER_SERVICE') &&
    (user.type === 'admin' || 
    user.type === 'technician')) {
      newActs.push({
        label: 'Log Services',
        onClick: stableLogService
      })
    }
    if (content.status === 'UNDER_SERVICE' &&
    (user.type === 'admin' || 
    user.type === 'supervisor')) {
      newActs.push({
        label: 'Verify Services',
        onClick: stableVerify
      });
    }
    if (content.status === 'VERIFIED' &&
    (user.type === 'admin' ||
    user.type === 'customer')) {
      newActs.push({
        label: 'Make payment',
        onClick: stablePay
      });
    }
    setAction(newActs);

    const attemptFetching = async () => {
      try {
        let carRes = await get(`/cars/${content.carId}`);
        setCar(`${carRes.model}(${carRes.brand})`);
        if (content.supervisorId) {
          let supRes = await get(`/user/${content.supervisorId}`);
          setSupervisor(supRes.name);
        }
        if (content.technicianId) {
          let techRes = await get(`/user/${content.technicianId}`);
          setTechnician(techRes.name);
        }
        if (content.customerId) {
          let custRes = await get(`/user/${content.customerId}`);
          setCustomer(custRes.name);
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (props.show)
      attemptFetching();
  }, [props.show,
    props.content,
    props.user, 
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
      <ButtonGroup>
      {
        action.length > 0 ?
        action.map((button, index) => 
        <div style={{ margin: 10 }}>
          <Button 
            onClick={button.onClick} 
            label={button.label}/>
        </div>)
         : <></>
      }
      </ButtonGroup>
    </Modal.Header>
    <Modal.Body style={{ maxHeight: '25rem', overflow: 'auto', fontFamily: 'Source' }}>
      <Table hover borderless>
        <tbody>
        {
          typeof props.content === 'object' ?
          [{ name: 'Job ID', value: props.content.id },
          { name: 'Car', value: car },
          { name: 'Customer', value: customer },
          { name: 'STATUS', value: props.content.status },
          { name: 'Booked On', value: props.content.bookingDate ? 
            new Date(props.content.bookingDate).toLocaleDateString() : undefined },
          { name: 'Accepted On', value: props.content.acceptedDate ? 
          new Date(props.content.acceptedDate).toLocaleDateString() : undefined },
          { name: 'Servicing started', value: props.content.appointedDate ? 
          new Date(props.content.appointedDate).toLocaleDateString() : undefined },
          { name: 'Deadline', value: props.content.deadlineDate ? 
          new Date(props.content.deadlineDate).toLocaleDateString() : undefined },
          { name: 'Supervisor', value: supervisor },
          { name: 'Technician', value: technician }].map((key, index) => 
            key.value ?
            <tr key={index}>
              <th>{key.name}</th>
              <td>{key.value}</td>
            </tr> : <></>
          ) : <></>
        }
        </tbody>
      </Table>
      <h5 style={{ marginLeft: 10 }}>Services :</h5>
      <Table hover borderless>
        <thead>
          <tr>
            {['Service', 'Cost', 'Completed On', 'Verified On'].map((key, index) => 
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
              service[key] !== null ? 
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
