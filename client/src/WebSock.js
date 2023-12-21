import React, { useState, useRef } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const WebSock = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef()
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('');
    function connect() {
        socket.current = new WebSocket('ws://localhost:5000');

        socket.current.onopen = () => {
            setConnected(true);
            const message = {
                username,
                event: 'connection',
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message));
        }
        
        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages(prev => [...prev, data]);
        }

        socket.current.onclose = () => {
            console.log('Socket is closed')
        }

        socket.current.onerror = () => {
            console.log('There is an error with Socket')
        }
    }

    const sendMessage = async () => {
        const message = {
            username,
            message: value, 
            id: Date.now(),
            event: 'message',
        }

        socket.current.send(JSON.stringify(message));
        setValue('');
    }

    if(!connected) {
        return (
            <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
            >
            <Modal.Dialog>
                <Modal.Header>
                <Modal.Title>Web Socket</Modal.Title>
                </Modal.Header>
        
                <Modal.Body>
                    <Form className="d-flex">
                        <Form.Control 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            type="text" placeholder="Enter your name" />
                        <Button onClick={connect} className="align-self-right" variant={"outline-dark"} >Enter</Button>
                    </Form>
                </Modal.Body>
            </Modal.Dialog>
            </div>
        )
    }

    return (
        <div
          className="modal show"
          style={{ display: 'block', position: 'initial'}}
        >
          <Modal.Dialog scrollable size={'xl'}>
            <Modal.Header>
              <Modal.Title>Web Socket</Modal.Title>
            </Modal.Header>

                <Col className='d-flex flex-column'>
                    <Modal.Body style={{ height: '35rem' }} className='border-end d-flex flex-column'>
                        {messages.map(mess => 
                            <Row className='align-self-start border px-3 py-2 m-1' key={mess.id}>
                                {mess.event === 'connection'
                                    ? <div className="text-body-secondary border-2"> User {mess.username} has been connected </div>
                                    : <div> {mess.username}. {mess.message}</div>
                                }
                            </Row>
                        )}
                    </Modal.Body>
                    <Form className="d-flex">
                        <Form.Control size={'lg'} value={value} onChange={e => setValue(e.target.value)} type="text" placeholder="Enter your message here..." />
                        <Button onClick={sendMessage} className="align-self-right" variant={"outline-dark"} >Send</Button>
                    </Form>
                </Col>
          </Modal.Dialog>
        </div>
      );
}

export default WebSock;