import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import { Button } from './Components';

export const ConfirmModal = (props) => {
  return (
  <Modal 
    show={props.show} 
    size='lg' 
    onHide={props.handleClose}
    centered>
    <Modal.Header closeButton>
      <Modal.Title style={{ fontFamily: 'Sansita' }}>
        Confirm this action
      </Modal.Title>
    </Modal.Header>
    <Modal.Body style={{ fontFamily: 'Source' }}>
      {
        Object.keys(props.content).length ?
        Object.keys(props.content).map((key, index) => {
          return <Row key={index}>
            <Col>{props.content[key].name}</Col>
            <Col sm='5'><strong>{props.content[key].work}</strong></Col>
            <Col sm='2'><strong>{props.content[key].cost}</strong></Col>
          </Row>
        }) : <p>Did nothing</p>
      }
    </Modal.Body>
    <Modal.Footer>
      <Button
        label='No'
        onClick={props.handleClose}/>
      <Button
        disabled={Object.keys(props.content).length === 0}
        label={props.action.label}
        onClick={props.action.onClick}/>
    </Modal.Footer>
  </Modal>);
}
