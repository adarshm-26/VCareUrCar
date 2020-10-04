import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Alert, Button } from './Components';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as car from '../cardata/CarsList'
import * as Yup from "yup";
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

  const [onError, setOnError] = useState(undefined);
  const history = useHistory();

  const token = localStorage.getItem('token');
  const formik = useFormik({
    initialValues: {
      brand: '',
      model: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      console.log('adding car');
      console.log(token);
      console.log(values);
      try {
        let response = await fetch('http://localhost:1112/cars/add', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,

            'cache': 'no-cache',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(values)
        });
        let result = await response.json();
        alert(result);
        history.push('/Cars');
      } catch (e) {
        console.error(e);
        setOnError(e.message);
      }
    }
  }
  );
  if (state.setSelected !== "other" && state.setSelected !== '') {
    formik.values.brand = state.setSelected;
  }
  if (model.setSelectedModel !== '' && model.setSelectedModel !== "other") {
    formik.values.model = model.setSelectedModel;
  }
  return (<>
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
    <Alert onError={onError} setOnError={setOnError} />
  </>);
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


