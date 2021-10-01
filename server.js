const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const URL = process.env.URL || "http://192.168.2.201:3000";


const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
      origin: URL,
      methods: ["GET", "POST"]
    }
  });
const socket_io = require('./socket_io');
socket_io(io)

// Middleware
app.use(express.json());
app.use(bodyParser.json({ limit: '500kb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
const PORT = process.env.PORT || 3001;

//Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

server.listen(PORT, () => console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`));