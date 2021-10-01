import logo from './logo.svg';
// import './App.css';
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Alert, Toast, ListGroup, Container, Row, Col, Button, InputGroup, FormControl, Card, Carousel } from 'react-bootstrap';
// import { BrowserRouter as Router, Route } from "react-router-dom";
import { useParams } from 'react-router-dom'
// import { XCircle, Folder2Open } from 'react-bootstrap-icons';
import { BsPersonFill } from "react-icons/bs";


let socket;

function App(props) {

  const ENDPOINT = 'http://192.168.2.201:3001';
  const params = useParams()
  const [name, setName] = useState(props.name);
  const [room, setRoom] = useState(params.id);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(['']);
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

    socket.emit('subscribeToEvent', 1000);


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
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}
        {messages.map((e, i) => < div key={i}>{e}</div>)}
        <Container style={{ backgroundColor: '#DCDCDC' }} fluid>
          <Row>
            <Col lg="12">
              <Carousel>
                <Carousel.Item>
                  <img
                    height="300"
                    className="d-block w-100"
                    src="https://source.unsplash.com/1600x900/"
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                {/* <Carousel.Item>
                                <img
                                  className="d-block w-100"
                                  src="https://source.unsplash.com/1600x400/water"
                                  alt="Second slide"
                                />

                                <Carousel.Caption>
                                  <h3>Second slide label</h3>
                                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </Carousel.Caption>
                              </Carousel.Item>
                              <Carousel.Item>
                                <img
                                  className="d-block w-100"
                                  src="https://source.unsplash.com/1600x400/water"
                                  alt="Third slide"
                                />

                                <Carousel.Caption>
                                  <h3>Third slide label</h3>
                                  <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                                </Carousel.Caption>
                              </Carousel.Item> */}
              </Carousel>
            </Col>
          </Row>
          <Row>
            <Col lg="2">
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
              <Row>
                {
                  message.split("").map((v, i) => {
                    return (
                      <Col sm={4} md={3} lg={12}>
                        <Card>
                          <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                            <Card.Text>
                              Some quick example text to build on the card title and make up the bulk of
                              the card's content.
                            </Card.Text>
                            <Card.Link href="#">Card Link</Card.Link>
                            <Card.Link href="#">Another Link</Card.Link>
                          </Card.Body>
                        </Card>
                      </Col>
                    )
                  })
                }
              </Row><Row>
                <Col>
                  <Card>
                    <ListGroup defaultActiveKey="0">
                      {
                        message.split("").map((v, i) => {
                          return (
                            <ListGroup.Item eventKey={i}>
                              qwe{v}
                            </ListGroup.Item>
                          )
                        })
                      }
                    </ListGroup>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col lg="10">
              <Container fluid>
                <Row>
                  {
                    message.split("").map((v, i) => {
                      if (v === '1') {
                        return (
                          <Col md="3">
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
                          </Col>
                        )
                      } else if (v === 'b') {
                        return (
                          <Col md="2">
                            <InputGroup key={`ig-${i}`} className="mb-3">
                              <Button
                                ref={(el) => (myRefs.current[i] = el)}
                                key={i}
                                id={i}
                                // onChange={(e) => sendEvent(e.target.value)}
                                onClick={(e) => console.log('onClick myRefs.current[i]: ', myRefs.current[i])}
                                onKeyDown={(e) => {
                                  console.log('selectionStart:', myRefs.current[i].selectionStart)
                                  setCurrentSelectionStart(myRefs.current[i].selectionStart)
                                }}
                              >
                                Send
                              </Button>
                            </InputGroup>
                          </Col>
                        )
                      } else if (v === '2') {
                        return (
                          <Col  sm={12} md={6} lg={3}>
                            <Card style={{ height: '100%' }}>
                              <Card.Header>Featured</Card.Header>
                              <Card.Img variant="top" src="https://source.unsplash.com/1600x900/" />
                              <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Text>
                                  Some quick example text to build on the card title and make up the bulk of
                                  the card's content.
                                </Card.Text>
                                <Button variant="primary">Go somewhere</Button>
                              </Card.Body>
                            </Card>
                          </Col>
                        )
                      } else if (v === '3') {
                        return (
                          <Col md="4">
                            <Card style={{ height: '100%' }}>
                              <Card.Header>Featured</Card.Header>
                              <Card.Img variant="top" src="https://source.unsplash.com/1600x900/" />
                              <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Text>
                                  Some quick example text to build on the card title and make up the bulk of
                                  the card's content.
                                </Card.Text>
                                <Button variant="primary">Go somewhere</Button>
                              </Card.Body>
                            </Card>
                          </Col>
                        )
                      } else if (v === '4') {
                        return (
                          <Col md="6">
                            <Card style={{ height: '100%' }}>
                              <Card.Header>Featured</Card.Header>
                              <Card.Img variant="top" src="https://source.unsplash.com/1600x900/" />
                              <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Text>
                                  Some quick example text to build on the card title and make up the bulk of
                                  the card's content.
                                </Card.Text>
                                <Button variant="primary">Go somewhere</Button>
                              </Card.Body>
                            </Card>
                          </Col>
                        )
                      } else if (v === '5') {
                        const variant = "danger"
                        return (
                          <Col md="6">
                            <Alert key={i} variant={variant}>
                              This is a {variant} alert—check it out!
                            </Alert>
                          </Col>
                        )
                      } else {
                        return (
                          <Col md="13">
                            <Carousel>
                              <Carousel.Item>
                                <img
                                  height="300"
                                  className="d-block w-100"
                                  src="https://source.unsplash.com/1600x900/"
                                  alt="First slide"
                                />
                                <Carousel.Caption>
                                  <h3>First slide label</h3>
                                  <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                                </Carousel.Caption>
                              </Carousel.Item>
                              {/* <Carousel.Item>
                                <img
                                  className="d-block w-100"
                                  src="https://source.unsplash.com/1600x400/water"
                                  alt="Second slide"
                                />

                                <Carousel.Caption>
                                  <h3>Second slide label</h3>
                                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </Carousel.Caption>
                              </Carousel.Item>
                              <Carousel.Item>
                                <img
                                  className="d-block w-100"
                                  src="https://source.unsplash.com/1600x400/water"
                                  alt="Third slide"
                                />

                                <Carousel.Caption>
                                  <h3>Third slide label</h3>
                                  <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                                </Carousel.Caption>
                              </Carousel.Item> */}
                            </Carousel>
                          </Col>
                        )
                      }
                    })
                  }
                </Row>
              </Container>
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
