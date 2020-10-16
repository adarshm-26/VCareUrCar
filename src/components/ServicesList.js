import React from 'react';
import { Container, ListGroup, Accordion, Card, Row } from 'react-bootstrap';
import { Header, Footer } from './Components';

export const Services = [
  { name: 'Change engine oil' },
  { name: 'Check level and refill brake and clutch fluid' },
  { name: 'Check brake pads, brake discs and replace' },
  { name: 'Check coolant hoses' },
  { name: 'Check charging system and battery' },
  { name: 'Check level and refill power steering fluid' },
  { name: 'Check level and refill transmission fluid' },
  { name: 'Grease and lubricate components' },
  { name: 'Replace the oil filter' },
  { name: 'Replace the air filter' },
  { name: 'Replace the fuel filter' },
  { name: 'Replace the cabin or a/c filter' },
  { name: 'Replace spark plug' },
  { name: 'Inspect and replace the timing belt or timing chain if needed' },
  { name: 'Check condition of the tires' },
  { name: 'Check for proper operation of all lights, wipers etc.'},
  { name: 'Check for any Error codes in the ECU and take corrective action'},
  { name: 'Complete check for rusting parts' }
];

const CombinedCosts = [
  { ids: [0,1,3,4,5,6,7], name: 'Regular', cost: '3500', id: 1 },
  { ids: [2,8,9,10,11,12,13,17], name: 'Extensive', cost: '14500', id: 2 },
  { ids: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], name: 'Complete', cost: '16500', id: 3 }
]

export const ServicePage = (props) => {
  return (<>
    <Header/>
    <Container style={{
      marginTop: '10rem',
      background: '#ffffff',
      border: '#000000 solid 1px',
      padding: '1rem'
    }}>
      <h1>Our Services</h1>
      <div style={{
        textAlign: 'start',
        padding: '1rem'
      }}>
        <h4>Categories</h4>
      </div>
      <Accordion defaultActiveKey={CombinedCosts[0].id}>
        {
          CombinedCosts.map((combination, index) => 
          <Card key={index}>
            <Accordion.Toggle as={Card.Header} eventKey={combination.id}>
              <Row style={{
                justifyContent: 'space-between',
                padding: '0 1rem'
              }}>
                <div>{combination.name}</div>
                <div>{combination.cost}</div>
              </Row>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={combination.id}>
              <Card.Body style={{ background: '#d9f8ff', textAlign: 'start' }}>
              Contains the following services grouped together : 
              {
                combination.ids.map((id, idx) =>
                  <li key={idx}>{Services[id].name}</li>)
              }
              </Card.Body>
            </Accordion.Collapse>
          </Card>)
        }
      </Accordion>
      <div style={{
        textAlign: 'start',
        padding: '1rem'
      }}>
        <h4>All services</h4>
      </div>
      <ListGroup style={{
        textAlign: 'start'
      }}>
      {
        Services.map((service, index) => 
        <ListGroup.Item key={index}>
          {service.name}
        </ListGroup.Item>)
      }
      </ListGroup>
    </Container>
    <Footer/>
  </>);
}
