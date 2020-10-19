import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Table, Spinner } from 'react-bootstrap';
import { Button, Alert, refreshIcon } from './Components';
import { get } from '../Utils';

export const CarDetailsModel = (props) => {
    console.log(props.car)
    const [loading, setLoading] = React.useState(false);
    const [onError, setOnError] = useState(undefined);
    const [user, setUser] = useState('');
    const attemptFetching = async () => {
        setLoading(true);
        try {
            let userRes = await get('/user/' + props.id);
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

    const stableAttemptFetching = React.useCallback(attemptFetching, [props.id]);

    React.useEffect(() => {
        if (props.id){
            setUser('');
            stableAttemptFetching();
        }
    }, [props.id, stableAttemptFetching]);

    return (<>
        <Modal
            show={props.show}
            onHide={props.handleClose}
            size='lg'
            centered>
            {
                loading ?
                    <Spinner
                        animation="border"
                        role="status"
                        style={{ margin: '10%' }}>
                        <span className="sr-only">Loading...</span>
                    </Spinner> :
                    user ?
                        <>
                            <Modal.Header>
                                <Modal.Title
                                    style={{ fontFamily: 'Sansita' }}>
                                    Car Specifics
                            </Modal.Title>
                            </Modal.Header>
                            <Modal.Body style={{ maxHeight: '25rem', overflow: 'auto', fontFamily: 'Source' }}>
                                <Table hover borderless>
                                    <tbody>
                                        {

                                            [{ name: 'Owner', value: user.name },
                                            { name: 'Car id', value: props.content.id },
                                            { name: 'Car Brand', value: props.content.brand },
                                            { name: 'Car Model', value: props.content.model }].map((key, index) =>
                                                <tr key={index}>
                                                    <th>{key.name}</th>
                                                    <td>{key.value}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </Table>
                                <Alert onError={onError} setOnError={setOnError} />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={props.handleClose} label='Close' />
                            </Modal.Footer></> : <div
                                onClick={attemptFetching}
                                style={{ fontSize: 20, cursor: 'pointer' }}>
                            <div>{refreshIcon}</div>
                            <div>Click to retry</div>
                        </div>
            }
        </Modal>

    </>);
}