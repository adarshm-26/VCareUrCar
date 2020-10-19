import React from 'react';
import { Card, Row, Container, Form } from 'react-bootstrap';
import { Header, Alert, Button, Footer } from './Components';
import { get } from '../Utils';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ReportSchema = Yup.object().shape({
  clazz: Yup.string()
    .oneOf(['Users','Jobs','Cars'],
      'Cannot generate report on given parameter')
    .required()
});

export const Reports = () => {
  const [onError, setOnError] = React.useState(undefined);
  const formik = useFormik({
    initialValues: {
      clazz: 'Users'
    },
    validationSchema: ReportSchema,
    onSubmit: async (values) => {
      try {
        let result = await get(`/reports/${values.clazz}`, 'pdf');
        let file = await result.blob();
        window.open(URL.createObjectURL(file));      
      } catch (e) {
        console.error(e);
        setOnError(e.message);
      }
    }
  });

  return (<>
    <Header/>
    <div style={{ 
      display: 'flex', 
      height: '100%', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'white'
    }}>
      <Container style={{
        width: '100%',
        height: '100%',
        padding: '120px'
      }}>
        <Card.Body>
          <Row>
            <h1 style={{
              textAlign: 'start',
              textDecoration: 'underline',
              flex: 1
            }}>
              Reports
            </h1>
          </Row>
          <Row style={{ fontSize: 30, fontFamily: 'Source' }}>
            {
              ['Users','Jobs','Cars'].map((clazz, index) => 
                <Form.Check
                  inline
                  style={{ margin: 15 }}
                  name='clazz'
                  type='radio'
                  label={clazz}
                  value={clazz}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  />
              )
            }
            {
              formik.touched.clazz ?
              <div>{formik.errors.clazz}</div> : <></>
            }
            </Row>
            <Button
              onClick={formik.handleSubmit}
              label='Get Report'
            />
        </Card.Body>
      </Container>
    </div>
    <Alert onError={onError} setOnError={setOnError}/>
    <Footer/>
  </>);
}
