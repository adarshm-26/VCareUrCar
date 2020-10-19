import React from 'react';
import { Modal, Form, Spinner, Row, Col } from 'react-bootstrap';
import { Button, Alert } from './Components';
import { Services, CombinedCosts } from './ServicesList'; 
import { post, get } from '../Utils';
import { useHistory } from 'react-router-dom';

export const BookingModal = (props) => {
  const [cars, setCars] = React.useState('');
  const [user, setUser] = React.useState([]);
  const [selectedCar, setSelectedCar] = React.useState('');
  const [selectedUser, setSelectedUser] = React.useState('');
  const [selectedGroup, setSelectedGroup] = React.useState('Individual');
  const [loading, setLoading] = React.useState(false);
  const [services, setServices] = React.useState('');
  const history = useHistory();

  const fetchAll = async () => {
    setLoading(true);
    try {
      let carsRes = await get('/cars/byUser/my');
      setCars(carsRes.content);
      if (carsRes.content.length > 0) 
        setSelectedCar(carsRes.content[0].id);
      let defaultSelectedServices = [];
      Services.map((value, index) => defaultSelectedServices[index] = false);
      setServices(defaultSelectedServices);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleServiceSelect = (event) => {
    let newServices = [...services];
    newServices[event.target.name] = !newServices[event.target.name];
    setServices(newServices);
  }

  const handleCarSelect = (event) => {
    event.preventDefault();
    setSelectedCar(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let selectedServices = [];
      if (selectedGroup === 'Individual') {
        Services.forEach((service, index) => {
          if (services[index])
            selectedServices.push(service);
        });
      } else {
        switch (selectedGroup) {
          case 'Regular' :
            CombinedCosts[0].ids.forEach((serviceId, index) => 
              selectedServices.push(Services[serviceId])
            );
            break;
          case 'Extensive' :
            CombinedCosts[1].ids.forEach((serviceId, index) => 
              selectedServices.push(Services[serviceId])
            );
            break;
          case 'Complete' :
            CombinedCosts[2].ids.forEach((serviceId, index) => 
              selectedServices.push(Services[serviceId])
            );
            break;
          default:
            console.error('Selected invalid group');
            break;
        }
      }
      await post('/jobs/book', {
        carId: selectedCar,
        customerId: selectedUser,
        status: 'BOOKED',
        bookingDate: new Date().getTime(),
        services: selectedServices
      }, { getResult: false });
      history.replace('/jobs');
    } catch (e) {
      console.error(e);
    }
  }

  React.useEffect(() => {
    if (props.show)
      fetchAll();
    if (props.user.type !== 'admin')
      setUser([props.user.email]);
    else {
      get('/user/all')
      .then(res => {
        setUser(res.content);
        setSelectedUser(res.content[0].id);
      })
      .catch(e => console.error(e));
    }
  }, [props.show, props.user]);

  return (
  <Modal 
    show={props.show} 
    size='lg' 
    onHide={props.handleClose}
    centered>
    <Modal.Header closeButton>
      <Modal.Title style={{ fontFamily: 'Sansita' }}>
        Book an appointment
      </Modal.Title>
    </Modal.Header>
    {
      loading ?
      <Spinner
        animation="border" 
        role="status" 
        style={{ margin: '10%' }}>
        <span className="sr-only">Loading...</span>
      </Spinner> :
      <>
        <Modal.Body style={{ fontFamily: 'Source' }}>
          <Form>
            {
              props.user?.type !== 'admin' ?
              <></> :
              <Form.Group 
                as={Row} 
                controlId='userInput' 
                key='user'>
                <Form.Label column sm='3'>
                  Customer User ID : 
                </Form.Label>
                <Col sm='7'>
                  <Form.Control
                    name='user'
                    value={selectedUser}
                    as='select'
                    placeholder='Exact ID of customer'
                    onChange={(e) => {
                      e.preventDefault();
                      setSelectedUser(e.target.value);
                    }}>
                    {
                      user.map((usr, index) => <option value={usr.id}>{usr.email}</option>)
                    }
                  </Form.Control>
                </Col>
              </Form.Group>
            }
            <Form.Group 
              as={Row} 
              controlId='selectCars' 
              key='car'>
              <Form.Label column sm='3'>
                Car to be serviced : 
              </Form.Label>
              <Col sm='7'>
                <Form.Control 
                  as='select' 
                  onChange={handleCarSelect}>
                  {
                    typeof cars === 'object' &&
                    cars.length > 0 ? 
                    cars.map((car, index) => {
                      return <option 
                        key={index} 
                        value={car.id}>
                          {car.model}
                        </option>
                    }) :
                    <option>No cars found</option>
                  }
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group 
              as={Row} 
              controlId='selectGroup' 
              key='group'
              style={{ alignItems: 'center' }}>
              <Form.Label column sm='3'>
                Select service group : <br/>
              </Form.Label>
              <Col 
                sm='7' 
                style={{ 
                  maxHeight: '10rem', 
                }}>
                {
                  [{name: 'Individual'}, ...CombinedCosts].map((group, index) => {
                    return <Form.Check
                      type='radio'
                      name='group'
                      key={index}
                      inline
                      label={group.name}
                      checked={group.name === selectedGroup}
                      onChange={(e) => {
                        setSelectedGroup(group.name);
                      }}
                    />;
                  })
                }
              </Col>
            </Form.Group>
            <Form.Group 
              as={Row} 
              controlId='selectServices' 
              key='service'
              style={{ alignItems: 'center' }}>
              <Form.Label column sm='3'>
                Select services individually : <br/>
                (scroll to see more)
              </Form.Label>
              <Col 
                sm='7' 
                style={{ 
                  maxHeight: '10rem', 
                  overflow: 'scroll', 
                  overflowX: 'hidden',
                }}>
                {
                  typeof services === 'object' ? 
                  services?.map((serviceInd, index) => {
                    return <Form.Check
                      type='checkbox'
                      name={index}
                      key={index}
                      disabled={selectedGroup !== 'Individual'}
                      label={Services[index].name}
                      onChange={handleServiceSelect}
                    />;
                  }) :
                  <div>No services found</div>
                }
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.handleClose} label='Close'/>
          <Button onClick={handleSubmit} label='Book'/>
        </Modal.Footer>
      </>
    }
  </Modal>);
}
