const {
    FunTypes,
    CommandTypes,
    QuestionTableEvent,
    QuestionTableEventTypes,
    QuestionTableAnswerTypes,
    QuestionTableAnswerEvent,
    ButtonAction } = require('./utils')
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

const UserState = {
    Unknown: 1,
    Connected: 2,
    Disconnected: 3
}

class User {
    constructor(id, name) {
        this.id = id
        this.name = name
        this.socket = undefined
        this.userState = UserState.Unknown
    }
}

const userSobhan = new User(1, 'سبحان')
const userMamdali = new User(2, 'محمد علی')
const userMojtaba = new User(3, 'مجتبی')
const userEsmail = new User(4, 'اسماعیل')
const userFateme = new User(5, 'فاطمه')
const userZahra = new User(6, 'زهرا')

class ClientHolder {
    constructor() {
        this.adminSocket = undefined
        this.users = [
            userSobhan,
            userMamdali,
            userMojtaba,
            userEsmail,
            userFateme,
        ]
    }
    onUserClicked(socket, userId) {

        for (let user of this.users) {
            if (user.id == userId) {
                user.socket = socket
                user.userState = UserState.Connected

                if (this.adminSocket != undefined) {
                    this.adminSocket.emit('user-connected', {
                        id: user.id,
                        name: user.name
                    })
                } else {
                    console.log('ADMIN NOT CONNECTED')
                }
                break
            }
        }
    }
    sendQuestionTable() {
        for (let user of this.users) {
            if (user.socket != undefined) {
                sendFunCommand(user.socket, createQuestionTable(user.id))
            }
        }
    }
}

var clientHolder = new ClientHolder();

function initializeListeners(socket) {

    socket.on('bc', msg => {
        console.log('button clicked', msg)
        clientHolder.onUserClicked(socket, msg.i)
    })

    socket.on('admin-command-32940rje', data => {

        if (data.type == 'init') {

            clientHolder.adminSocket = socket

        } else if (data.type == 'reload') {

            sendReloadPage()

        } else if (data.type == 'start-party') {

            startParty()

        } else if (data.type == 'resume') {

            sendResumeCommand()
        } else if (data.type == 'fun') {
            switch (data.fun) {
                case 'start-question-table': {

                    clientHolder.sendQuestionTable()
                    break;
                }
                default: {
                    throw new Error('unrecognized fun type received from admin: ', data.fun)
                }
            }
        } else if (data.type == 'qt-open-question') {

            sendQuestionTableOpenQuestionButton()

        } else {

            console.error('INVALID ADMIN COMMAND TYPE: ', data.type)

        }
    })

    socket.on(QuestionTableAnswerEvent, data => {
        console.log('Answered: ', data)
        sendQuestionTableCloseQuestion(data)
        // sendResumeCommand()
    })

    // sendFunCommand(socket, createSampleQuestionTable())

    // sendQuestionTableOpenQuestionText(socket)
    // sendQuestionTableOpenQuestionButton(socket)

    // for (let guy of guys) {
    //     sendFunCommand(socket, createButtonFun(guy.id, guy.text))
    // }
    // sendFunCommand(socket, createGroup(3000, [
    //     createImageFun(0, '/assets/img/img3-exp.gif'),
    //     createSoundFun(0, '/assets/aud/aud3-exp.mp3')
    // ]))
    // // sendFunCommand(socket, createColorFun(1000, 'red'))

    // sendFunCommand(socket, createGroup(5000, [
    //     createImageFun(0, '/assets/img/img4-ali.png'),
    //     createSoundFun(0, '/assets/aud/aud1.mp3')
    // ]))
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
    // sendFunCommand(socket, createImageFun(2000, '/assets/img/img4-ali.png'))
    // sendFunCommand(socket, createSoundFun(1000 * 5, '/assets/aud/aud1.mp3'))
    // sendFunCommand(socket, createImageFun(1000, '/assets/img/img2-ali.jpg'))
    // sendFunCommand(socket, createSoundFun(1000 * 5, '/assets/aud/aud2.mp3'))

}

function startParty() {
    // identify users
    for (let user of clientHolder.users) {
        sendFunCommand(socketIo.sockets, createButtonFun(user.id, user.name))
    }
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

function sendReloadPage() {
    socketIo.sockets.emit('c', {
        t: CommandTypes.ReloadPage
    })
}
function sendResumeCommand() {
    socketIo.sockets.emit('c', {
        t: CommandTypes.ResumeGenerator
    })
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
function sendQuestionTableOpenQuestionButton() {
    socketIo.sockets.emit(QuestionTableEvent, {
        t: QuestionTableEventTypes.OpenQuestion,
        bd: 1500,
        qid: 1,
        at: QuestionTableAnswerTypes.Button,
        b: [
            { v: 'مهر', a: ButtonAction.Jigh },
            { v: 'اردیبهشت', a: ButtonAction.Jigh },
            { v: 'خرداد', a: ButtonAction.Default },
            { v: 'مرداد', a: ButtonAction.Jigh }
        ]
    })
    socketIo.sockets.emit(QuestionTableEvent, {
        t: QuestionTableEventTypes.OpenQuestion,
        bd: 1500,
        qid: 2,
        at: QuestionTableAnswerTypes.Button,
        b: [
            { v: 'مجتبی', a: ButtonAction.Jigh },
            { v: 'حسن', a: ButtonAction.Default },
            { v: 'علی بنیادی', a: ButtonAction.Jigh },
            { v: 'خودش', a: ButtonAction.Jigh }
        ]
    })
    socketIo.sockets.emit(QuestionTableEvent, {
        t: QuestionTableEventTypes.OpenQuestion,
        bd: 1500,
        qid: 3,
        at: QuestionTableAnswerTypes.Button,
        b: [
            { v: 'مگه مجتبی کیف داره؟', a: ButtonAction.Jigh },
            { v: 'جیب بزرگه', a: ButtonAction.Jigh },
            { v: 'دوم', a: ButtonAction.Default },
            { v: 'هیچکدام', a: ButtonAction.Jigh }
        ]
    })
    socketIo.sockets.emit(QuestionTableEvent, {
        t: QuestionTableEventTypes.OpenQuestion,
        bd: 1500,
        qid: 4,
        at: QuestionTableAnswerTypes.Button,
        b: [
            { v: 'فقط میلادیشو بلدم', a: ButtonAction.Jigh },
            { v: 'هجدهم', a: ButtonAction.Default },
            { v: 'هفدهم', a: ButtonAction.Jigh },
            { v: 'شانزدهم', a: ButtonAction.Jigh }
        ]
    })
    socketIo.sockets.emit(QuestionTableEvent, {
        t: QuestionTableEventTypes.OpenQuestion,
        bd: 1500,
        qid: 5,
        at: QuestionTableAnswerTypes.Button,
        b: [
            { v: 'کلنگ', a: ButtonAction.Jigh },
            { v: 'دسته چک', a: ButtonAction.Jigh },
            { v: 'چاقو', a: ButtonAction.Jigh },
            { v: 'فر', a: ButtonAction.Jigh }
        ]
    })
}
function sendQuestionTableOpenQuestionText(socket) {
    socketIo.sockets.emit(QuestionTableEvent, {
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
function createQuestionTable(myuid) {
    return {
        t: FunTypes.QuestionTable,
        d: 0,
        v: {
            r: [
                {
                    uid: userMojtaba.id,
                    q: `تولد اسماعیل چه ماهیه؟ (${userMojtaba.name})`,
                    qid: 1
                },
                {
                    uid: userEsmail.id,
                    q: `سبحان موهای پای چه کسی را آتش زد؟ (${userEsmail.name})`,
                    qid: 2
                },
                {
                    uid: userSobhan.id,
                    q: `مجتبی موس لپتاپش رو توی جیب چندم کیفش میذاره؟ (${userSobhan.name})`,
                    qid: 3
                },
                {
                    uid: userMamdali.id,
                    q: `شرکت روز چندم ماه شمسی تاسیس شده؟ (${userMamdali.name})`,
                    qid: 4
                },
                {
                    uid: userZahra.id,
                    q: `نام وسیله آشپزخانه مورد علاقه فاطمه چیست؟ (${userZahra.name})`,
                    qid: 5
                }
            ],
            muid: myuid
        }
    }
}
