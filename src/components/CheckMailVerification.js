import React, { useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';
import { post } from '../Utils';
import { useAuth } from '../context/auth';

import { useHistory, Link } from 'react-router-dom';

const RegisterSchema = Yup.object().shape({
    verificationcode: Yup.string()
        .min(4, 'Too short')
        .required('Required')
})
export const CheckMailVerification = () => {
    const [onError, setOnError] = useState(undefined);
    const [verifycode, setVerfyCode] = useState('');
    const [loading, setLoading] = React.useState(false);
    const [verificationcode, setCode] = useState('');
    const history = useHistory();
    const { signIn } = useAuth();

    const attemptFetching = async (e) => {
        setLoading(true);
        try {
            let result = await post('/authenticate', {
                username: localStorage.getItem('usermail'),
                password: localStorage.getItem('userpassword')
            }, { withAuth: false });
            if (result.token) {
                signIn(result.token);
            }
            await post('/user/sendmail', {
                email: localStorage.getItem('usermail')
            }, { getResult: false });
        }
        catch (e) {
            console.error(e);
            setOnError(e.message);
        }
        finally {
            setLoading(false);
        }
    }

    const stableAttemptFetching = React.useCallback(attemptFetching, []);

    React.useEffect(() => {
        stableAttemptFetching();
    }, [stableAttemptFetching]);

    return (<div style={{
        display: 'flex',
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        {
            loading ?
                <Spinner
                    animation="border"
                    role="status"
                    style={{ margin: '10%' }}>
                    <span className="sr-only">Loading...</span>
                </Spinner> :

                <Card style={{
                    width: '80%',
                    maxWidth: '20rem',
                    border: '1px solid #000000'
                }}>
                    <Card.Body>
                        <Card.Title>verify mail</Card.Title>
                        <Card.Subtitle>enter your verification code</Card.Subtitle>
                        <Form onSubmit={async (e) => {
                            e.preventDefault();
                            console.log('verifying....');
                            try {
                                await post('/user/validatemail', {
                                    email: localStorage.getItem('usermail'),
                                    verificationcode: verificationcode
                                }, { getResult: false });
                                history.push('/profile');
                            } catch (e) {
                                console.error(e);
                                setOnError(e.message);
                            }
                        }}>
                            <Form.Control
                                style={{ marginTop: 20 }}
                                type='text'
                                name='verificationcode'
                                value={verificationcode}
                                placeholder='Ex:12345'
                                onChange={(val) =>
                                    setCode(val.target.value)
                                } />

                            <Button
                                style={{ marginTop: '20px', marginBottom: '10px' }}
                                type='submit'
                                label='verify mail'
                            >verify mail</Button>
                        </Form>
                    </Card.Body>
                    <p onClick={async (e) => {
                        setLoading(true);
                        try {
                            await post('/user/sendmail', {
                                email: localStorage.getItem('usermail')
                            }, { getResult: false });
                        }
                        catch (e) {
                            console.error(e);
                            setOnError(e.message);
                        }
                        finally {
                            setLoading(false);
                        }
                    }}> click to resend</p>
                    <Alert onError={onError} setOnError={setOnError} />

                </Card>
        }

    </div>)


}
