const socket_io = (io) => {
    // const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
    // const users = {};

    io.on('connection', (socket) => {
        console.log('socket.id:', socket.id)
        socket.emit('yourID', socket.id);
        socket.join('1');

        socket.on('join', ({ name, room }, callback) => {
            console.log('name:', name)
            console.log('room', room)

            // if (error) return callback(error);
            socket.join(room);
            // socket.emit('message', { user: 'admin', message: `${user.name}, welcome to room ${user.room}.` });
            // socket.broadcast.to(room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
            // io.to(room).emit('roomData', { room, users: getUsersInRoom(user.room) });
            callback();
        });
        
        socket.on('send', (data) => {
            console.log('send:', data)            
            // socket.emit('message', data);
            io.to('1').emit('message', data);
        })
        
        socket.on('event', (data) => {
            console.log('event:', data)            
            // socket.emit('message', data);
            io.to('1').emit('event', data);
        })
        
        socket.on('disconnect', () => {
            console.log('disconnect:', socket.id)
        })
    })

    // io.on('connection', (socket) => {
    //     console.log('socket.id:', socket.id)
    //     if (!users[socket.id]) {
    //         users[socket.id] = socket.id;
    //         // const { error, user } = addUser({ id: socket.id, name: socket.id, room: 'room' });
    //         const { error, user } = addUser({ id: socket.id, name: socket.id, room: 'TBD' });
    //         console.log('name:', user.name)
    //         console.log('room', user.room)
    //     }
    //     // socket.emit('yourID', socket.id);
    //     // io.sockets.emit('allUsers', users);
    //     // io.sockets.emit('allUsers', getUsersInRoom('room'));
    //     socket.on('disconnect', () => {
    //         delete users[socket.id];
    //         const user = removeUser(socket.id);
    //         if (user) {
    //             io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
    //             io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    //         }
    //         io.sockets.emit('allUsers', getUsersInRoom('room'));
    //     })

    //     // socket.on('callUser', (data) => {
    //     //     io.to(data.userToCall).emit('hey', { signal: data.signalData, from: data.from });
    //     // })

    //     // socket.on('acceptCall', (data) => {
    //     //     io.to(data.to).emit('callAccepted', data.signal);
    //     // })

    //     socket.on('join', ({ name, room }, callback) => {
    //         const dUser = removeUser(socket.id);
    //         const { error, user } = addUser({ id: socket.id, name, room });
    //         console.log('name:', user.name)
    //         console.log('room', user.room)

    //         if (error) return callback(error);
    //         socket.join(user.room);
    //         socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
    //         socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    //         io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    //         callback();
    //     });

    //     socket.on('sendMessage', (message, callback) => {
    //         console.log('sendMessage: ' + message)
    //         const user = getUser(socket.id);
    //         // io.to(user.room).emit('message', { user: user.name, text: message });
    //         io.to(user.room).emit('message', { user: user.name, text: message });
    //         callback();
    //     });

    //     socket.on('disconnect', () => {
    //         delete users[socket.id];
    //         const user = removeUser(socket.id);
    //         if (user) {
    //             io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
    //             io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    //         }
    //     })
    // })
}

module.exports = socket_io;