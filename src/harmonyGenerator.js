const { FunTypes, CommandTypes } = require('./utils')
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

const guys = [
    { id: 1, text: 'سبحان' },
    { id: 2, text: 'محمد علی' },
    { id: 3, text: 'مجتبی' },
    { id: 4, text: 'پارسا' },
    { id: 5, text: 'رضا' },
    { id: 6, text: 'حاجی' },
]

function initializeListeners(socket) {

    socket.on('bc', msg => {
        console.log('button clicked', msg)
        socket.emit('c', {
            t: CommandTypes.ResumeGenerator
        })
    })

    for (let guy of guys) {
        sendButtonCommand(socket, guy.id, guy.text)
    }
    sendColor(socket, 1000, 'red')
    sendColor(socket, 1000, 'green')
    sendColor(socket, 1000, 'blue')
    sendColor(socket, 500, '#2499ff')
    sendColor(socket, 500, '#120da3')
    sendColor(socket, 500, '#bf1f67')
    sendColor(socket, 500, '#1fbf8f')
    sendColor(socket, 500, '#e6cd2c')

    setTimeout(() => {


        for (let guy of guys) {
            sendButtonCommand(socket, guy.id, guy.text)
        }
    }, 10000)
}

function sendButtonCommand(socket, id, text) {
    socket.emit('c', {
        t: CommandTypes.Fun,
        f: {
            t: FunTypes.Button,
            d: 0,
            v: {
                i: id,
                t: text
            }
        }
    })
}

function sendColor(socket, duration, color) {
    socket.emit('c', {
        t: CommandTypes.Fun,
        f: {
            t: FunTypes.Color,
            d: duration,
            v: {
                c: color
            }
        }
    })
}
