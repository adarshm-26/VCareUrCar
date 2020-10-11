import React, { useState } from 'react';
import { Spinner, Row, Col, Table, Modal, Button, Container, Badge, ListGroup } from 'react-bootstrap';
import { Header, Alert } from './Components';
import { useHistory } from 'react-router-dom';
import { AddCar } from './AddCar';
import { get } from '../Utils.js';

const refreshIcon = <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.5 14.5C3.63401 14.5 0.5 11.366 0.5 7.5C0.5 5.26904 1.54367 3.28183 3.1694 2M7.5 0.5C11.366 0.5 14.5 3.63401 14.5 7.5C14.5 9.73096 13.4563 11.7182 11.8306 13M11.5 10V13.5H15M0 1.5H3.5V5" stroke="black" />
</svg>;

export const Cars = () => {
  const [cars, setCar] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [onError, setOnError] = React.useState(undefined);
  const token = localStorage.getItem('token');
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [showAddCar, setAddCar] = useState(false);
  const handleCarAddShow = () => setAddCar(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleAddCarClose = () => setAddCar(false);
  const [user, setUser] = useState('');
  const attemptFetching = async () => {
    setLoading(true);
    try {
      let carRes = await get('/cars/byUser/my');
      setCar(carRes['content']);
      let userRes = await get('/user/me');
      setUser(userRes);
      if(user.enable===false){
        history.push('/verifymail');
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
  React.useEffect(() => {
    attemptFetching();
  }, []);
  console.log(cars)
  return (<>
    <Header />
    <div style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <Container>
        <Row style={{ height: '100px' }}></Row>
        <Row className="justify-content-md-center">
          <Col xs={12} md={8}>
            <h1 style={{
              textAlign: 'start',
              textDecoration: 'underline',
              width: '437px',
              height: '104px',

              top: '140px'
            }}>My Cars</h1>
          </Col>
          <Col xs={6} md={4}>
            <Button
              style={{
                align: 'left',
                width: '149.46px',
                height: '55px',
              }}
              variant="outline-primary"

              onClick={handleCarAddShow}

            >Add Car</Button>
          </Col>
        </Row>

      </Container>
      <Container>
        <Row className="justify-content-md-center">
          {CarModal()}
          {

            loading ?
              <Spinner
                animation="border"
                role="status"
                style={{ margin: '10%' }}>
                <span className="sr-only">Loading...</span>
              </Spinner> :
              cars ?
                <>{
                  typeof cars === 'object' && cars.length > 0 ?
                    <Table striped bordered hover size="md">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Car Brand</th>
                          <th>Car Model</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {

                          cars.map((car, index) =>
                            <tr>
                              <td>{car.id}</td>
                              <td>{car.brand}</td>
                              <td>{car.model}</td>
                              {Example(car.id)}
                              <td><Button varient="outline-light" onClick={handleShow} title="delete car">delete</Button></td>
                            </tr>
                          )

                        }
                      </tbody>
                    </Table> : <p>No cars found</p>
                }
                </> : <div
                  onClick={attemptFetching}
                  style={{ fontSize: 20, cursor: 'pointer' }}>
                  <div>{refreshIcon}</div>
                  <div>Click to retry</div>
                </div>

          }
        </Row>

      </Container>
    </div>
    <Alert onError={onError} setOnError={setOnError} />
  </>);

  function remove(carid) {
    return async (e) => {
      e.preventDefault();
      console.log('removing car');
      try {
         await fetch('http://localhost:1112/cars/remove', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'cache': 'no-cache'
          },
          body: JSON.stringify({
            id: carid
          })
        });
        
        history.push('/cars');
      } catch (e) {
        console.error(e);
        setOnError(e.message);
      }
    }
  }
  function Example(id) {
    return (
      <>
        <Modal show={show} onHide={handleClose} animation={false} size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Are You Sure .. ?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure wnat to delete!</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={remove(id)}>
              Yes
              </Button>
            <Button variant="primary" onClick={handleClose}>
              No
              </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  function CarModal() {
    return (<>
      <Modal show={showAddCar} onHide={handleAddCarClose} animation={false}
        align="center">
        <Modal.Header closeButton >
          <Modal.Title id="contained-modal-title-vcenter" >
            Add car details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body align="center">
          <AddCar />
        </Modal.Body>
      </Modal>
    </>);
  }

}

