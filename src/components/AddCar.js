import React, { useState } from 'react';
import { Form, Modal, Spinner } from 'react-bootstrap';
import { Alert, Button } from './Components';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as car from '../cardata/CarsList';
import * as Yup from "yup";
import { get ,post} from '../Utils.js';



const refreshIcon = <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.5 14.5C3.63401 14.5 0.5 11.366 0.5 7.5C0.5 5.26904 1.54367 3.28183 3.1694 2M7.5 0.5C11.366 0.5 14.5 3.63401 14.5 7.5C14.5 9.73096 13.4563 11.7182 11.8306 13M11.5 10V13.5H15M0 1.5H3.5V5" stroke="black" />
</svg>;


const RegisterSchema = Yup.object().shape({
  model: Yup.string().required(),
  brand: Yup.string().required()
});
export const AddCar = (props) => {
  const [state, setState] = useState('');
  const [model, setModel] = useState('');
  console.log(state);
  console.log(model);
  const [loading, setLoading] = React.useState(false);
  const [onError, setOnError] = useState(undefined);
  const history = useHistory();
  const [user, setUser] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      
      await post('/cars/add', {
        ownerId: user,
        brand:state,
        model:model
      }, { getResult: false });
      
      history.replace('/cars');
    } catch (e) {
      console.error(e);
    }
  }
  React.useEffect(() => {
    if (props.user.type !== 'supervisor')
      setUser(props.user.id);
  }, [props.show, props.user]);
 
  
  return (<Modal show={props.show} 
    size='lg' 
    onHide={props.handleClose}
    centered>
    <Modal.Header closeButton>
      <Modal.Title style={{ fontFamily: 'Sansita' }}>
        Add Car Details
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <div>
      {

        loading ?
          <Spinner
            animation="border"
            role="status"
            style={{ margin: '10%' }}>
            <span className="sr-only">Loading...</span>
          </Spinner> :
          user ?
          
            <Form >
              <Form.Control as="select"
                style={{ marginTop: 20 }}
                name='model'
                onChange={(e) => {
                  setState( e.target.value );
                }}>
                <option value="">select car brand</option>
                {car.groupedOptions.map((props) => {
                  return <option value={props.label}>{props.label}</option>;
                })}
                <option value="other">other</option>
              </Form.Control>
              
              {renderSecondSelect(state)}
              {renderIfOtherModel(model)}
            </Form>
            :<></>
      }
    </div>
    <Alert onError={onError} setOnError={setOnError} />
    </Modal.Body>
    <Modal.Footer>
          <Button onClick={props.handleClose} label='Close'/>
          <Button onClick={handleSubmit} label='Book'/>
    </Modal.Footer>
    
  </Modal>
  );

  function renderSecondSelect(selected) {

    if (!selected) {
      return (<>
        <Form.Control as="select"
          style={{ marginTop: 20 }}
          name='model'
        >
          <option value="">select brand to continue</option>

        </Form.Control>
        
      </>);
    }
    if (selected !== "other") {

      return (
        <>
          <Form.Control as="select"
            style={{ marginTop: 20 }}
            
            onChange={(e) => {
              setModel( e.target.value );
            }}
          >
            <option value="">select car model</option>
            {car[selected].map((props) => {
              return <option value={props.label}>{props.label}</option>;
            })}
            <option value="other">other</option>
          </Form.Control>
          
        </>
      );
    }

    else {
      model.setSelectedModel = '';
      return (
        <>
          {renderIfOther(selected)};
        </>
      )
    }

  }
  function renderIfOther(selected) {
    if (!selected) {
      return (<>

      </>);
    }
    if (selected === "other") {
      return (<>
        <Form.Control
          style={{ marginTop: 20 }}
          type='text'
          name='brand'
          placeholder='Enter brand name'
          onChange={(e) => {
                      e.preventDefault();
                      setState(e.target.value);
                    }}
        />
        <Form.Control
          style={{ marginTop: 20 }}
          type='text'
          name='model'
          placeholder='Enter model name'
          onChange={(e) => {
                      e.preventDefault();
                      setModel(e.target.value);
                    }}
        />
      </>);
    }
  }
  function renderIfOtherModel(selected) {

    if (!selected) {
      return (<>

      </>);
    }
    if (selected === "other") {

      return (<>

        <Form.Control
          style={{ marginTop: 20 }}
          type='text'
          name='model'
          placeholder='Enter model name'
          onChange={(e) => {
                      e.preventDefault();
                      setModel(e.target.value);
                    }}
        />
      </>);
    }
  }


}


