import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Container, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
// import { BrowserRouter as Router, Route } from "react-router-dom";
import { useParams } from 'react-router-dom'


let socket;

function App(props) {

  const ENDPOINT = 'http://192.168.2.201:3001';
  const params = useParams()
  const [name, setName] = useState(props.name);
  const [room, setRoom] = useState(params.id);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(['hi']);
  const [currentSelectionStart, setCurrentSelectionStart] = useState(0);

  const [socketId, setSocketId] = useState();

  const inputElem = useRef()
  const myRefs = useRef([]);

  useEffect(() => {
    console.log('params: ', params)
    console.log('props:', props)
    console.log('name:', name)
    console.log('room:', room)
  }, []);

  useEffect(() => {
    console.log('useEffect socketId:', socketId)
  }, [socketId]);

  useEffect(() => {
    console.log('messages:', messages)
  }, [messages]);

  useEffect(() => {
    // console.log('selectionStart:', inputElem.current.selectionStart)

  }, [message]);


  useEffect(() => {
    socket = io(ENDPOINT);
    console.log('socket: ', socket)

    socket.on('yourID', data => {
      console.log('yourID: ', data)
      setSocketId(data)
    });

    socket.on('message', data => {
      setMessages(messages => [...messages, data.message]);
    });

    socket.on('event', data => {
      console.log('event: ', data)
      console.log('event socket.id: ', socket.id)
      // if (data.id !== socket.id) {
      setMessage(data.data)
      // }

      // [0, 1, 2].map((v, i) => {
      //   console.log(myRefs.current[i])
      // })

    });

    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT]);

  const sendMessage = (message) => {
    // event.preventDefault();
    if (message) {
      socket.emit('send', { id: socket.id, message });
    }
  }

  const sendEvent = (data) => {
    // event.preventDefault();
    if (data) {
      socket.emit('event', { id: socket.id, data });
    }
  }

  return (
    // <Router>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {messages.map((e, i) => < div key={i}>{e}</div>)}
        <Container>
          <Row>
            <Col lg="3">
              <InputGroup className="mb-3">
                <FormControl
                  ref={inputElem}
                  onKeyDown={(e) => {
                    console.log('selectionStart:', inputElem.current.selectionStart)
                    setCurrentSelectionStart(inputElem.current.selectionStart)
                  }}
                  value={message}
                  onChange={(e) => sendEvent(e.target.value)}
                  placeholder="Message"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                />
                <InputGroup.Text id="basic-addon2" onClick={() => sendMessage(message)}>Send</InputGroup.Text>
              </InputGroup>
            </Col>
            <Col>
              {
                message.split("").map((v, i) => {
                  return (
                    <InputGroup key={`ig-${i}`} className="mb-3">
                      <FormControl
                        ref={(el) => (myRefs.current[i] = el)}
                        key={i}
                        id={i}
                        // onChange={(e) => sendEvent(e.target.value)}
                        onClick={(e) => console.log('onClick myRefs.current[i]: ', myRefs.current[i])}
                        onKeyDown={(e) => {
                          console.log('selectionStart:', myRefs.current[i].selectionStart)
                          setCurrentSelectionStart(myRefs.current[i].selectionStart)
                        }}
                      />
                    </InputGroup>
                  )
                })
              }
            </Col>
            {/* <Col>
              {
                [1, 2, 3].map((v, i) => {
                  return (
                    <button
                      ref={(el) => (myRefs.current[i] = el)}
                      key={i}
                      id={i}
                      onClick={(e) => console.log(myRefs.current[i])}
                    >{`Button${i}`}</button>
                  )
                })
              }
            </Col> */}
          </Row>
        </Container>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div >
    // </Router>
  );
}

export default App;
