import React, { useState } from 'react';
import {
  Card,
  Spinner,
  Container,
  ListGroup,
  Badge,
  Row,
  Modal,
} from 'react-bootstrap';
import {
  Header,
  Alert,
  Button,
  CarDetailsModel,
  AddCar,
  Footer,
  refreshIcon
} from './Components';
import { get, post } from '../Utils';
import { Paginate } from './Paginate';
import { useHistory } from 'react-router-dom';

export const Cars = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const history = useHistory();
  const [onError, setOnError] = React.useState(undefined);
  const [cars, setCars] = React.useState('');
  const [user, setUser] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showAddCar, setAddCar] = useState(false);
  const [modalContent, setModalContent] = React.useState('');
  const [id,setId] =React.useState('');
  const [carTabPage, setCarTabPage] = React.useState(0);

  const handleAddCarClose = () => setAddCar(false);

  const attemptFetching = async () => {
    setLoading(true);
    try {
      let userRes = await get('/user/me');
      setUser(userRes);
      if(userRes.enable===false){
        history.push('/verifymail')
      }
      let carsRes = await get(`/cars/byUser/my?page=${carTabPage}`);
      setCars(carsRes);
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
    [carTabPage]);

  React.useEffect(() => {
    stableAttemptFetching();
  }, [stableAttemptFetching]);

  const triggerShowModal = (car,id) => {
    setId(id);
    setModalContent(car);
    setShowModal(true);
  }

  const hideModal = () => setShowModal(false);
  return (<>
    <Header />
    <div style={{
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'white',
      overflow: 'auto'
    }}>
      {CarModal()}
      {
        loading ?
          <Spinner
            animation="border"
            role="status"
            style={{ margin: '10%' }}>
            <span className="sr-only">Loading...</span>
          </Spinner> :
          user && cars ?
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
                    }}>My Cars</h1>
                    {
                      user.type === 'customer' || user.type === 'admin' ?
                        <div style={{ flex: 2, textAlign: 'end' }}>
                          <Button
                            onClick={() => setAddCar(true)}
                            label='Add'
                          />
                        </div> : <></>
                    }
                  </Row>
                  <CarDetailsModel
                    handleClose={hideModal}
                    show={showModal}
                    content={modalContent}
                    id={id}
                  />
                  {
                    user.type !== 'customer' && user.type !=='admin'?
                    <>nothing to show here</> :
                    <ListGroup style={{ marginTop: 20, fontFamily: 'Source' }}>
                      {
                        typeof cars === 'object' &&
                          cars.content?.length > 0 ?
                          cars.content.map((car, index) =>
                            <ListGroup.Item
                              key={index}
                              action>
                              <CarDetailsLayout car={car} user={user} trigger={() => triggerShowModal(car,car.ownerId)}
                                show={handleShow} />
                              {RemoveUserCar(car.id)}
                            </ListGroup.Item>
                          ) : 
                          <p>
                            No Cars Found<br />
                            pls register your car details to show
                          </p>
                      }
                      <Paginate
                        content={cars}
                        pageNo={carTabPage}
                        setPage={setCarTabPage}
                        callback={stableAttemptFetching} />
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
    <Alert onError={onError} setOnError={setOnError} />
    <Footer/>
  </>);
  
  function remove(carid) {
    return async (e) => {
      e.preventDefault();
      console.log('removing car');
      try {
        await post('/cars/remove', {
          id: carid
        }, { getResult: false });
        window.location.reload();
        history.replace('/cars');
      } catch (e) {
        console.error(e);
        setOnError(e.message);
      }
    }
  }

  function RemoveUserCar(id) {
    return (<>
      <Modal show={show} onHide={handleClose} animation={false} size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Are You Sure .. ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure wnat to delete!</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={remove(id)} label='Yes'>
            Yes
            </Button>
          <Button variant="primary" onClick={handleClose} label='No'>
            No
            </Button>
        </Modal.Footer>
      </Modal>
    </>);
  }

  function CarModal() {
    return (<>
      <Modal show={showAddCar} onHide={handleAddCarClose} centered>
        <Modal.Header closeButton >
          <Modal.Title id="contained-modal-title-vcenter" 
            style={{ fontFamily: 'Sansita'}}>
            Add car details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontFamily: 'Source' }}>
          <AddCar user={user} />
        </Modal.Body>
      </Modal>
    </>);
  }
}

const CarDetailsLayout = (props) => {
  return <Row key={props.id} >
    <div style={{ flex: 1 }} onClick={props.trigger}>
      <Badge
        style={{ fontSize: 16 }}
        variant='info'>
        Show
      </Badge>
    </div>
    <div style={{ flex: 1 }}>
      {props.car.brand}
    </div>
    <div style={{ flex: 1 }}>
      {props.car.model}
    </div>
    <div style={{ flex: 1 }} >
      {
        props.user.type !== 'supervisor' && props.user.type !== 'technician' ?
          <Badge
            onClick={props.show}
            style={{ fontSize: 16 }}
            variant='danger'>
            Delete
      </Badge> :
          <div style={{ flex: 2 }}>
          </div>
      }
    </div>
  </Row>
}
