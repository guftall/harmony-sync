const io = require('socket.io');

exports.initializeSocketio = function initializeSocketio(httpServer) {

    var socketIo = io(httpServer);

    socketIo.on('connection', socket => {
        console.log('connected ', socket.id)
    })

    return socketIo
}