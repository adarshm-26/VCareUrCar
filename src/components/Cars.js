import React from 'react';
import { Card, Spinner, Row, Col,Table,Container } from 'react-bootstrap';
import { Header, Alert ,Button } from './Components';
import { useHistory } from 'react-router-dom';
import {MarutiSuzuki} from '../cardata/CarsList'

export const Cars = () => {
    const [car, setCar] = React.useState(undefined);
    const [loading, setLoading] = React.useState(false);
    const [onError, setOnError] = React.useState(undefined);
    const history = useHistory();
    
  
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
      <Row >
      <Col xs={8}>
            <h1 style={{
                  textAlign: 'start',
                  textDecoration: 'underline',
                  
                    
                    width: '437px',
                    height: '104px',
                    left: '91px',
                    top: '140px'
                }}>My Cars</h1>
                </Col>
                <Col>
          <Button 
            style={{
            
                    width: '149.46px',
                    height: '55px',
                    left: '1011px',
                    top: '140px',
                }}
            onClick={() => history.push('/addCar')}
            label='Add'
            /></Col>
            <Col>
            <Button 
            style={{
                    width: '149.46px',
                    height: '55px',
                    left: '1196.65px',
                    top: '140px'
                    
                }}
            onClick={() => history.push('/removeCar')}
            label='remove'
            /></Col>
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
                  
                </tr>
              </thead>
              
              <tbody>
                  {car.map(post =>{
                   
                    return(
                     
                    
                    
                        <tr>
                          <td>{post.id}</td>
                          <td>{post.brand}</td>
                          <td>{post.model}</td>
                          
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