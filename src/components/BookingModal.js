import React from 'react';
import { Modal, Form, Spinner, Row, Col } from 'react-bootstrap';
import { Button, Alert } from './Components';
import { Services } from './ServicesList'; 
import { post, get } from '../Utils';
import { useHistory } from 'react-router-dom';

export const BookingModal = (props) => {
  const [cars, setCars] = React.useState('');
  const [user, setUser] = React.useState('');
  const [selectedCar, setSelectedCar] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [services, setServices] = React.useState('');
  const history = useHistory();

  const fetchAll = async () => {
    setLoading(true);
    try {
      let carsRes = await get('/cars/byUser/my');
<<<<<<< Updated upstream
      setCars(carsRes.content);
      if (carsRes.content.length > 0) 
        setSelectedCar(carsRes.content[0].id);
      let defaultSelectedServices = [];
=======
      setCars(carsRes['content']);
      if (carsRes.length > 0) setSelectedCar(carsRes[0].id);
      let defaultSelectedServices = {};
>>>>>>> Stashed changes
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
      Services.forEach((service, index) => {
        if (services[index])
          selectedServices.push(service);
      });
      await post('/jobs/book', {
        carId: selectedCar,
        customerId: user,
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
      setUser(props.user.id);
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
        <Modal.Body>
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
                    value={user}
                    placeholder='Exact ID of customer'
                    onChange={(e) => {
                      e.preventDefault();
                      setUser(e.target.value);
                    }}/>
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
<<<<<<< Updated upstream
                    typeof cars === 'object' &&
                    cars.length > 0 ? 
                    cars.map((car, index) => {
                      return <option 
                        key={index} 
                        value={car.id}>
                          {car.model}
                        </option>
=======
                    typeof cars === 'object' && cars.length > 0 ? cars.map((car, index) => {
                      return <option key={index} value={car.id}>{car.model}</option>
>>>>>>> Stashed changes
                    }) :
                    <option>No cars found</option>
                  }
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group 
              as={Row} 
              controlId='selectServices' 
              key='service'
              style={{ alignItems: 'center' }}>
              <Form.Label column sm='3'>
                Select services : <br/>
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
