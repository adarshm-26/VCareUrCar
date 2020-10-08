import React, { useState ,component} from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { Alert, Button } from './Components';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as car from '../cardata/CarsList';
import * as Yup from "yup";
import { get ,post} from '../Utils.js';
import { Component } from 'react';


const refreshIcon = <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.5 14.5C3.63401 14.5 0.5 11.366 0.5 7.5C0.5 5.26904 1.54367 3.28183 3.1694 2M7.5 0.5C11.366 0.5 14.5 3.63401 14.5 7.5C14.5 9.73096 13.4563 11.7182 11.8306 13M11.5 10V13.5H15M0 1.5H3.5V5" stroke="black" />
</svg>;


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
  const history = useHistory();
  const [user, setUser] = useState('');
  const token = localStorage.getItem('token');
  const formik = useFormik({
    initialValues: {
      brand: '',
      model: '',
      ownerId: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      console.log('adding car');
      console.log(token);
      console.log(values);
      formik.values.ownerId = user.id;
      try {
        let response = await post('/cars/add', {
          
         brand:formik.values.brand,
         model:formik.values.model,
         ownerId:formik.values.ownerId
        },{getResult:false});
        let result = await response.json();
        alert(result);
        history.push('/cars');
      } catch (e) {
        console.error(e);
        setOnError(e.message);
      }
    }
  }
  );
  const attemptFetching = async () => {
    setLoading(true);
    try {
      let userRes = await get('/user/me');
      setUser(userRes);


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
          user ?
            <Form onSubmit={formik.handleSubmit}>
              <Form.Control as="select"
                style={{ marginTop: 20 }}
                name='model'
                onChange={(e) => {
                  setState({ setSelected: e.target.value });
                }}>
                <option value="">select car brand</option>
                {car.groupedOptions.map((props) => {
                  return <option value={props.label}>{props.label}</option>;
                })}
                <option value="other">other</option>
              </Form.Control>
              <div style={{ color: 'red', textAlign: 'start' }}>
                {
                  formik.touched.brand &&
                    formik.values.brand === "" ? 'please select brand name ' : ''
                }
              </div>
              {renderSecondSelect(state.setSelected)}
              {renderIfOtherModel(model.setSelectedModel)}

              <Button style={{ marginTop: '15px' }} type="submit" label='Submit' />
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
          <option value="">select brand to continue</option>

        </Form.Control>
        <div style={{ color: 'red', textAlign: 'start' }}>{
          formik.touched.model &&
            formik.values.model === "" ? 'please select model name ' : ''}
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
            <option value="">select car model</option>
            {car[selected].map((props) => {
              return <option value={props.label}>{props.label}</option>;
            })}
            <option value="other">other</option>
          </Form.Control>
          <div style={{ color: 'red', textAlign: 'start' }}>{
            formik.touched.model &&
              formik.values.model === "" ? 'please select model name ' : ''}
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


