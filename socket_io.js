const r = require("rethinkdb");

const socket_io = (io) => {
    // const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
    // const users = {};

    const r = require("rethinkdb");

    r.connect({
        host: "192.168.2.81",
        port: 28015,
        db: "test",
    }).then((connection) => {
        // io.on("connection", (client) => {
        //     client.on("subscribeToTimer", (interval) => {
        //         console.log("client is subscribing to timer with interval ", interval);

        //         r.table("timers")
        //             .changes({ include_initial: true })
        //             .run(connection)
        //             .then((cursor) => {
        //                 cursor.each((err, timerRow) => {
        //                     client.emit("timer", timerRow.new_val.timestamp);
        //                 });
        //             });

        //         //   setInterval(() => {
        //         //     client.emit("timer", new Date());
        //         //   }, interval);
        //     });

        //     client.on("publishLine", (line) => {
        //         //   console.log("saving line to the db", line);
        //         r.table("timers")
        //             //   .insert(Object.assign({ timestamp: line }))
        //             .get("fa448a41-f628-4209-ae38-dd40819f4a8c")
        //             .update(Object.assign({ timestamp: line }))
        //             .run(connection);
        //     });
        // });

        io.on('connection', (socket) => {
            console.log('socket.id:', socket.id)
            socket.emit('yourID', socket.id);
            socket.join('1');



            socket.on('join', ({ name, room }, callback) => {
                console.log('name:', name)
                console.log('room', room)
                // client.emit("message", `${name} has joined!`);

                r.table("users")
                    .changes({ include_initial: true })
                    .run(connection)
                    .then((cursor) => {
                        cursor.each((err, timerRow) => {
                            console.log('cursor name:', name)
                            // client.emit("message", { user: 'admin', text: `admin has joined!` });
                            // client.emit("message", `${name} has joined!`);
                            socket.broadcast.to('1').emit('message', ` has joined!`);
                        });
                    });

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


            socket.on("subscribeToEvent", (interval) => {
                console.log("client is subscribing to timer with interval ", interval);

                r.table("chat_app_layout")
                    .changes({ include_initial: true })
                    .run(connection)
                    .then((cursor) => {
                        cursor.each((err, dataRow) => {
                            console.log(dataRow)
                            //   client.emit("timer", timerRow.new_val.timestamp);
                            io.to('1').emit('event', dataRow.new_val);
                        });
                    });

                //   setInterval(() => {
                //     client.emit("timer", new Date());
                //   }, interval);
            });

            socket.on('event', (data) => {
                console.log('event:', data)
                // socket.emit('message', data);

                r.table("chat_app_layout")
                    //   .insert(Object.assign({ timestamp: line }))
                    .get("1")
                    .update(Object.assign({ data: data.data }))
                    .run(connection)

                io.to('1').emit('event', data);
            })

            socket.on('disconnect', () => {
                console.log('disconnect:', socket.id)
            })
        })
    });



}

module.exports = socket_io;