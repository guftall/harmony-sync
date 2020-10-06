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

exports.onClientConnected = function (socket) {

    console.log('connected ', socket.id)
    initializeListeners(socket)
}

function onCalled() {

    socketIo.sockets.emit('haji-bd', 'HMM')
}

function initializeListeners(socket) {
    
    socket.on('bc', msg => {
        console.log('button clicked', msg)
    })
}