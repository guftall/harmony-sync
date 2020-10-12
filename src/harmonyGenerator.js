const { FunTypes, CommandTypes, QuestionTableEvent, QuestionTableEventTypes, QuestionTableAnswerTypes, QuestionTableAnswerEvent } = require('./utils')
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
        socketIo.sockets.emit('c', {
            t: CommandTypes.ResumeGenerator
        })
    })

    socket.on(QuestionTableAnswerEvent, data => {
        console.log('Answered: ', data)
        sendQuestionTableCloseQuestion(data)
    })

    sendFunCommand(socket, createSampleQuestionTable())

    setTimeout(() => {
        sendQuestionTableOpenQuestionButton(socket)
    }, 3000)

    setTimeout(() => {
        sendQuestionTableOpenQuestionText(socket)
    }, 8000)

    for (let guy of guys) {
        sendFunCommand(socket, createButtonFun(guy.id, guy.text))
    }
    sendFunCommand(socket, createGroup(3000, [
        createImageFun(0, '/assets/img/img3-exp.gif'),
        createSoundFun(0, '/assets/aud/aud3-exp.mp3')
    ]))
    // sendFunCommand(socket, createColorFun(1000, 'red'))

    sendFunCommand(socket, createGroup(5000, [
        createImageFun(0, '/assets/img/img4-ali.png'),
        createSoundFun(0, '/assets/aud/aud1.mp3')
    ]))
    // sendFunCommand(socket, createGroup(10000, [
    //     createColorFun(0, '#1fbf8f'),
    //     createSoundFun(0, '/assets/aud/aud2.mp3')
    // ]))
    // sendFunCommand(socket, createVideoFun(8000, '/assets/vid/vid1.mp4'))
    // sendFunCommand(socket, createGroup(8000, [
    //     createVideoFun(8000, '/assets/vid/vid1.mp4'),
    //     createSoundFun(0, '/assets/aud/aud1.mp3')
    // ]))
    // sendFunCommand(socket, createImageFun(2000, '/assets/img/img1-haji.png'))
    sendFunCommand(socket, createImageFun(2000, '/assets/img/img4-ali.png'))
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
function sendQuestionTableCloseQuestion(data) {
    socketIo.sockets.emit(QuestionTableEvent, {
        t: QuestionTableEventTypes.CloseQuestion,
        qid: data.qid,
        a: data.a
    })
}
function sendQuestionTableOpenQuestionButton(socket) {
    socket.emit(QuestionTableEvent, {
        t: QuestionTableEventTypes.OpenQuestion,
        bd: 1000,
        qid: 2,
        at: QuestionTableAnswerTypes.Button,
        b: [
            {v: 'رونیکا'},
            {v: 'خلیج'},
            {v: 'خلیج'},
            {v: 'خلیج'}
        ]
    })
}
function sendQuestionTableOpenQuestionText(socket) {
    socket.emit(QuestionTableEvent, {
        t: QuestionTableEventTypes.OpenQuestion,
        bd: 1000,
        qid: 1,
        at: QuestionTableAnswerTypes.Text
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

function createVideoFun(duration, url) {
    return {
        t: FunTypes.Video,
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

function createSampleQuestionTable() {
    return {
        t: FunTypes.QuestionTable,
        d: 0,
        v: {
            r: [
                {
                    uid: 1,
                    q: 'ما کجاییم؟',
                    qid: 1
                },
                {
                    uid: 2,
                    q: 'چرا آخه؟',
                    qid: 2
                },
                {
                    uid: 2,
                    q: 'تا کِی؟',
                    qid: 2
                },
            ],
            muid: 1
        }
    }
}
