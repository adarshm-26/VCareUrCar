import React from 'react';
import { Modal, Form, Spinner, Row, Col } from 'react-bootstrap';
import { Button } from './Components';
import { Services } from './ServicesList'; 
import { post, get } from '../Utils';

export const BookingModal = (props) => {
  const [cars, setCars] = React.useState('');
  const [selectedCar, setSelectedCar] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [services, setServices] = React.useState('');
  const [result, setResult] = React.useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      let carsRes = await get('/cars/byUser/my');
      setCars(carsRes);
      if (carsRes.length > 0) setSelectedCar(carsRes[0].id);
      let defaultSelectedServices = {};
      Services.map((value, index) => defaultSelectedServices[index] = false);
      setServices(defaultSelectedServices);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleServiceSelect = (event) => {
    event.preventDefault();
    let newServices = {...services};
    newServices[event.target.name] = event.target.value;
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
      let result = await post('/jobs/book', {
        carId: selectedCar,
        customerId: props.user.id,
        status: 'BOOKED',
        bookingDate: new Date(),
        services: selectedServices
      }, { getResult: false });
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  }

  React.useEffect(() => {
    if (props.show)
      fetchAll();
  }, [props.show]);

  return (<Modal show={props.show} size='lg' onHide={props.handleClose}>
    <Modal.Header closeButton>
      <Modal.Title style={{ fontFamily: 'Sansita' }}>Book an appointment</Modal.Title>
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
            <Form.Group as={Row} controlId='selectCars' key='car'>
              <Form.Label column sm='3'>Car to be serviced : </Form.Label>
              <Col sm='7'>
                <Form.Control as='select' onChange={handleCarSelect}>
                  {
                    typeof cars === 'object' ? cars.map((car, index) => {
                      return <option key={index} value={car.id}>{car.model}</option>
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
              style={{ alignItems: 'center' }}
              >
              <Form.Label column sm='3'>Select services : <br/>(scroll to see more)</Form.Label>
              <Col 
                sm='7' 
                style={{ 
                  maxHeight: '10rem', 
                  overflow: 'scroll', 
                  overflowX: 'hidden',
                }}>
                {
                  typeof services === 'object' ? Object.keys(services).map((serviceInd, index) => {
                    return <Form.Check
                      type='checkbox'
                      id={serviceInd}
                      name={serviceInd}
                      key={index}
                      label={Services[serviceInd].name}
                      value={services[serviceInd]}
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
