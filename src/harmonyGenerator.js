var danceStarted = false;
var socketIo;

exports.startDance = function startDance(socketio) {

    if (!danceStarted) {
        danceStarted = true
        console.log('dance started')
        socketIo = socketio
    }

    return onCalled
}

function onCalled() {

    socketIo.sockets.emit('haji-bd', 'HMM')
}