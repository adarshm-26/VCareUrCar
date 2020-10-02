import React ,{ useState } from 'react';
import { Card, Spinner, Row, Col,Table,Modal,Button,Container} from 'react-bootstrap';
import { Header, Alert } from './Components';
import { useHistory } from 'react-router-dom';

import { useFormik } from 'formik';

export const RemoveCar = () => {
    const [car, setCar] = React.useState(undefined);
    const [loading, setLoading] = React.useState(false);
    const [onError, setOnError] = React.useState(undefined);
    const token=localStorage.getItem('token');
    const history = useHistory();
    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    
    
  
    if (!loading && !onError && !car) {
      setLoading(true);
      fetchUserCars()
      .then(car => {
        setCar(car);
        console.log(car);
      })
      .catch(e => {
        console.error(e);
        setOnError(e.message);
      })
      .finally(() => {
        setLoading(false);
      })
    }
    
  
    return (<>
      <Header/>
      <div style={{ justifyContent: 'center', alignItems: 'center' ,backgroundColor:'white' }}>
      <Container>
      <Row style={{height:'40px'}}></Row>
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
                    align:'left',
                    width: '149.46px',
                    height: '55px',
                    
                }}
                variant="outline-primary"
                
            onClick={() => history.push('/addCar')}
            
            >Add Car</Button>
    </Col>
            
          
            
               
                </Row>
                
                </Container>
                
          
        <Container>
        <Row className="justify-content-md-center">
      { !car ?
        <Spinner 
          animation="border" 
          role="status" 
          style={{ margin: '10%' }}>
          <span className="sr-only">Loading...</span>
        </Spinner> :

                
         
          
                <Table striped bordered hover size="sm"  >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Car Brand</th>
                  <th>Car Model</th>
                  <th>Delete</th>
                  
                </tr>
              </thead>
              
              <tbody>
                  {car.map(post =>{
                   
                    return(
                     
                    
                    
                        <tr>
                          <td>{post.id}</td>
                          <td >{post.brand}</td>
                          <td>{post.model}</td>
                          {Example(post.id)}
                          
                          <td><Button variant="outline-light" onClick={handleShow} title="delete car"><img src="https://www.freeiconspng.com/uploads/delete-error-exit-remove-stop-x-cross-icon--28.png" width="20px" height="20px" alt="delete " /></Button></td>
                          
                        </tr>
                      
                    )
                  }
                  )}
                  </tbody>
                  </Table>
      }</Row>
                 
      </Container>
        </div>
        <Alert onError={onError} setOnError={setOnError}/>
      
    </>);
     function remove(carid){
       
        return async (e) => {
          e.preventDefault();
          
          console.log('removing car');
          
          try {
            let response = await fetch('http://localhost:1112/cars/remove', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'cache': 'no-cache'
              },
              body: JSON.stringify({
                  id:carid
              })
            });
            let result = await response.json();
            
            history.push('/removeCar');
          } catch (e) {
            console.error(e);
            setOnError(e.message);
          }
          
        }
    }
    function Example(id) {
      
      return (
        <>
          
    
          <Modal show={show} onHide={handleClose} animation={false}>
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
    
    
  }


const fetchUserCars = async () => {
    const token = localStorage.getItem('token');
    let response = await fetch('http://localhost:1112/cars/byUser/my', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'cache': 'no-cache'

      }
    });
    let carDetails = await response.json();
    
    return carDetails;
  }


  