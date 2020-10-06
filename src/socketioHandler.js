const io = require('socket.io');

exports.initializeSocketio = function initializeSocketio(httpServer, onClientConnected) {

    var socketIo = io(httpServer);

    if (onClientConnected == undefined) {
        throw new Error('undefined client connected cb')
    }

    socketIo.on('connection', onClientConnected)

    return socketIo
}