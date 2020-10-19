import React, { useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { Alert, Button, refreshIcon } from './Components';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as car from '../cardata/CarsList';
import * as Yup from "yup";
import { get, post } from '../Utils.js';

const RegisterSchema = Yup.object().shape({
  model: Yup.string().required(),
  brand: Yup.string().required()
});
export const AddCar = () => {
  const [state, setState] = useState({
    setSelected: ""
  });
  const [model, setModel] = useState({
    setSelectedModel: ""
  });
  console.log(state.setSelected);
  console.log(model.setSelectedModel);
  const [loading, setLoading] = React.useState(false);
  const [onError, setOnError] = useState(undefined);
  const [setId,setSelectedUser] =useState('');
  const [users,setUsers] =useState('');
  const history = useHistory();
  const [user, setUser] = useState('');
  const formik = useFormik({
    initialValues: {
      brand: '',
      model: '',
      ownerId: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      console.log('adding car');
      console.log(values);
      if(users){
        formik.values.ownerId = setId;
      }else{
        formik.values.ownerId = user.id;
      }
      try {
        await post('/cars/add', {
          brand: formik.values.brand,
          model: formik.values.model,
          ownerId: formik.values.ownerId
        }, { getResult: false });
        window.location.reload();
        history.replace('/cars');
      } catch (e) {
        console.error(e);
        setOnError(e.message);
      }
    }
  });

  const attemptFetching = async () => {
    setLoading(true);
    try {
      let userRes = await get('/user/me');
      setUser(userRes);
      if(userRes.type==='admin'){
        let usersRes = await get('/user/all');
        setUsers(usersRes['content'])
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


  if (state.setSelected !== "other" && state.setSelected !== '') {
    formik.values.brand = state.setSelected;
  }
  if (model.setSelectedModel !== '' && model.setSelectedModel !== "other") {
    formik.values.model = model.setSelectedModel;
  }
  return (<>
    <div>
      {

        loading ?
          <Spinner
            animation="border"
            role="status"
            style={{ margin: '10%' }}>
            <span className="sr-only">Loading...</span>
          </Spinner> :
          user.type==='customer' || (user.type==='admin' && users) ?
          
            <Form onSubmit={formik.handleSubmit}>
            {
              user.type==='admin'  ?
              <Form.Control as="select" style={{ marginTop: 20 }} name='userId' onChange={(e)=>{setSelectedUser(e.target.value)}}>
              <option value="">Select user to add car</option>
              {users.map((props) => {
                  return <option value={props.id}>{props.email}</option>;
                })}
              </Form.Control>:<></>
            }
              <Form.Control as="select"
                style={{ marginTop: 20 }}
                name='model'
                onChange={(e) => {
                  setState({ setSelected: e.target.value });
                }}>
                <option value="">Select car brand</option>
                {car.groupedOptions.map((props) => {
                  return <option value={props.label}>{props.label}</option>;
                })}
                <option value="other">Other</option>
              </Form.Control>
              <div style={{ color: 'red', textAlign: 'start' }}>
                {
                  formik.touched.brand &&
                    formik.values.brand === "" ? 'Please select brand name ' : ''
                }
              </div>
              {renderSecondSelect(state.setSelected)}
              {renderIfOtherModel(model.setSelectedModel)}
              <div style={{
                width: '100%',
                textAlign: 'end'
              }}>
                <Button 
                  style={{ marginTop: '15px' }} 
                  type="submit" 
                  label='Submit'/>
              </div>
            </Form>

            : <div
              onClick={attemptFetching}
              style={{ fontSize: 20, cursor: 'pointer' }}>
              <div>{refreshIcon}</div>
              <div>Click to retry</div>
            </div>

      }
    </div>
    <Alert onError={onError} setOnError={setOnError} />
  </>
  );
  function renderSecondSelect(selected) {

    if (!selected) {
      return (<>
        <Form.Control as="select"
          style={{ marginTop: 20 }}
          name='model'
        >
          <option value="">Select brand to continue</option>

        </Form.Control>
        <div style={{ color: 'red', textAlign: 'start' }}>{
          formik.touched.model &&
            formik.values.model === "" ? 'Please select model name ' : ''}
        </div>
      </>);
    }
    if (selected !== "other") {

      return (
        <>
          <Form.Control as="select"
            style={{ marginTop: 20 }}
            onBlur={formik.handleBlur}
            onChange={(e) => {
              setModel({ setSelectedModel: e.target.value });
            }}
          >
            <option value="">Select car model</option>
            {car[selected].map((props) => {
              return <option value={props.label}>{props.label}</option>;
            })}
            <option value="other">Other</option>
          </Form.Control>
          <div style={{ color: 'red', textAlign: 'start' }}>{
            formik.touched.model &&
              formik.values.model === "" ? 'Please select model name ' : ''}
          </div>
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
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />

        <div style={{ color: 'red', textAlign: 'start' }}>
          {
            formik.touched.model ?
              formik.errors.model : ''
          }
        </div>
        <Form.Control
          style={{ marginTop: 20 }}
          type='text'
          name='model'
          value={formik.values.model}
          placeholder='Enter model name'
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />

        <div style={{ color: 'red', textAlign: 'start' }}>
          {
            formik.touched.model ?
              formik.errors.model : ''
          }
        </div>
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
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />

        <div style={{ color: 'red', textAlign: 'start' }}>
          {
            formik.touched.model ?
              formik.errors.model : ''
          }
        </div>
      </>);
    }
  }


}


