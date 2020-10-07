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
        sendFunCommand(socket, createButtonFun(guy.id, guy.text))
    }
    sendFunCommand(socket, createColorFun(1000, 'red'))
    // sendColor(socket, 1000, 'green')
    // sendColor(socket, 1000, 'blue')
    // sendColor(socket, 500, '#2499ff')
    // sendColor(socket, 500, '#120da3')
    // sendColor(socket, 500, '#bf1f67')
    // sendColor(socket, 500, '#1fbf8f')
    // sendColor(socket, 500, '#e6cd2c')
    sendFunCommand(socket, createGroup(5000, [
        createImageFun(0, '/assets/img/img2-ali.jpg'),
        createSoundFun(0, '/assets/aud/aud1.mp3')
    ]))
    sendFunCommand(socket, createGroup(10000, [
        createColorFun(0, '#1fbf8f'),
        createSoundFun(0, '/assets/aud/aud2.mp3')
    ]))
    sendFunCommand(socket, createGroup(10000, [
        createImageFun(0, '/assets/img/img2-ali.jpg'),
        createSoundFun(0, '/assets/aud/aud2.mp3')
    ]))
    // sendFunCommand(socket, createImageFun(2000, '/assets/img/img1-haji.png'))
    // sendFunCommand(socket, createImageFun(2000, '/assets/img/img2-ali.jpg'))
    // sendFunCommand(socket, createSoundFun(1000 * 5, '/assets/aud/aud1.mp3'))
    // sendFunCommand(socket, createImageFun(1000, '/assets/img/img2-ali.jpg'))
    // sendFunCommand(socket, createSoundFun(1000 * 5, '/assets/aud/aud2.mp3'))

}

function createButtonFun(id, text) {
    return {
        t: FunTypes.Button,
        d: 0,
        v: {
            i: id,
            t: text
        }
    }
}

function createColorFun(duration, color) {
    return {
        t: FunTypes.Color,
        d: duration,
        v: {
            c: color
        }
    }
}

function createImageFun(duration, url) {
    return {
        t: FunTypes.Image,
        d: duration,
        v: {
            u: url
        }
    }
}

function sendFunCommand(socket, fun) {
    socket.emit('c', {
        t: CommandTypes.Fun,
        f: fun
    })
}
function createSoundFun(duration, url) {
    return {
        t: FunTypes.Sound,
        d: duration,
        v: {
            u: url
        }
    }
}

function createGroup(duration, funs) {
    return {
        t: FunTypes.Group,
        d: duration,
        fl: funs
    }
}
