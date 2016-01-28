var express = require('express');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', function(socket) {


    socket.on('disconnect', function() {
        io.emit('chat message', 'User disconnected');
    });

    socket.on('chat message', function(msg) {
        socket.broadcast.emit('chat message', msg);
    });

    socket.on('user joined', function(userName) {
        io.emit('chat message', userName + ' joined the chat');
    });

    socket.on('is typing', function(userName) {
        socket.broadcast.emit('is typing', userName);
    });

    socket.on('stopped typing', function(userName) {
        socket.broadcast.emit('stopped typing', userName);
    });

});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
