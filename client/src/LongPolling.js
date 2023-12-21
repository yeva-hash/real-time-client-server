import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import axios from 'axios'

const LongPolling = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');

    useEffect(() => {
        subscribe();
    }, [])

    const subscribe = async () => {
        try {
            const {data} = await axios.get('http://localhost:5000/get-messages')
            setMessages(prev => [data, ...prev])
            await subscribe();
        } catch (e) {
            setTimeout(() => {
                subscribe()
            },500)
        }
    }

    const sendMessage = async () => {
        await axios.post('http://localhost:5000/new-messages', {
            message: value,
            id: Date.now()
        }).then(
            setValue('')
        )
    }

    return (
        <div
          className="modal show"
          style={{ display: 'block', position: 'initial' }}
        >
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Title>Long Polling</Modal.Title>
            </Modal.Header>
    
            <Modal.Body>
                <Form className="d-flex">
                    <Form.Control value={value} onChange={e => setValue(e.target.value)} type="text" placeholder="Enter your message here..." />
                    <Button onClick={sendMessage} className="align-self-right" variant={"outline-dark"} >Send</Button>
                </Form>
            </Modal.Body>
            <Modal.Footer className='d-flex flex-column'>
                {messages.map(mess => 
                    <Row className='align-self-start border px-3 py-2' key={mess.id}>
                        {mess.message}
                    </Row>
                )}
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      );
}

export default LongPolling;