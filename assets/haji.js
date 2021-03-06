class FunGenerator {
    constructor(wrapper) {
        this.funQueue = []
        this.wrapper = wrapper
        this.started = false
        this.currenExecuting = undefined
    }

    append(fun) {

        const that = this

        function onExecuteQueueFun() {
            if (that.funQueue.length == 0) {
                that.currenExecuting = undefined
                console.log('empty fun queue')
                return
            }

            const fun = that.funQueue.splice(0, 1)[0]
            that.currenExecuting = fun

            fun.startedAt = new Date()

            // if fun duration is zero next fun should start explicity
            if (fun.fun.duration == 0) {

            } else {

                // set timeout so we execute next job when this job finished
                fun.timeref = setTimeout(() => {
                    fun.finishedAt = new Date()
                    onExecuteQueueFun()
                }, fun.fun.duration)
            }

            that.runFun.bind(that)(fun.fun)
        }

        this.funQueue.push({
            createdAt: new Date(),
            fun: fun,
            execute: onExecuteQueueFun.bind(fun)
        })

        if (this.started && this.currenExecuting == undefined) {
            this.funQueue[0].execute()
        }
    }

    start() {
        if (this.started) {
            throw new Error('fun generator already started')
        }
        this.started = true

        if (this.funQueue.length == 0) {
            return
        }
        this.funQueue[0].execute()
    }

    resumeAfterInfinite() {
        if (this.currenExecuting == undefined || this.currenExecuting.fun.duration != 0) {
            throw new Error('not paused on infinite fun')
        } else if (this.funQueue.length == 0) {
            console.log('resume called, but there is no fun to execute')
            return
        }

        this.onExecuteQueueFun()
    }
    createColorElement(color) {

        var colorNode = document.createElement('div')
        colorNode.style.backgroundColor = color
        colorNode.style.height = '100%'
        colorNode.style.width = '100%'

        return colorNode
    }
    createImageElement(url) {

        const imageNode = document.createElement('img')
        imageNode.src = url
        imageNode.style.width = 'auto'
        imageNode.style.height = '100%'
        imageNode.style.margin = '0 auto'

        return imageNode
    }
    createButtonElement(text, onClick) {

        var buttonNode = document.createElement('button')
        buttonNode.innerHTML = text
        buttonNode.style.width = '100px'
        buttonNode.style.height = '60px'
        buttonNode.style.margin = 'auto auto'
        buttonNode.classList.add("btn", "btn-info")
        buttonNode.onclick = onClick

        return buttonNode
    }
    createSoundElement(url) {

        var audioNode = document.createElement('audio')
        audioNode.src = url
        audioNode.style.display = 'none'

        return audioNode
    }
    createVideoElement(url) {

        var videoElement = document.createElement('video')
        videoElement.src = url
        videoElement.style.width = '100%'
        videoElement.style.height = '100%'

        return videoElement
    }
    runFun(fun) {
        console.log('run fun:', fun)
        $(this.wrapper).children().remove()
        switch (fun.type) {
            case FunTypes.Color: {
                var colorNode = this.createColorElement(fun.variables.color)

                this.wrapper.appendChild(colorNode)
                break
            }
            case FunTypes.Button: {

                var buttonNode = this.createButtonElement(fun.variables.text, fun.onClick.bind(fun))

                this.wrapper.appendChild(buttonNode)
                break
            }
            case FunTypes.Image: {

                const imageNode = this.createImageElement(fun.variables.url)

                this.wrapper.appendChild(imageNode)
                break
            }
            case FunTypes.Sound: {
                var audioNode = this.createSoundElement(fun.variables.url)

                audioNode.play()

                this.wrapper.appendChild(audioNode)
                break
            }
            case FunTypes.Video: {
                var videoNode = this.createVideoElement(fun.variables.url)
                videoNode.play()
                
                this.wrapper.appendChild(videoNode)
                break;
            }
            case FunTypes.Group: {
                for (let f of fun.funs) {
                    switch (f.type) {
                        case FunTypes.Image: {
                            var imageNode = this.createImageElement(f.variables.url)
                            this.wrapper.appendChild(imageNode)
                            break
                        }
                        case FunTypes.Sound: {
                            var soundNode = this.createSoundElement(f.variables.url)
                            soundNode.play()
                            this.wrapper.appendChild(soundNode)
                            break
                        }
                        case FunTypes.Color: {
                            var colorNode = this.createColorElement(f.variables.color)
                            this.wrapper.appendChild(colorNode)
                            break
                        }
                        case FunTypes.Video: {
                            var videoNode = this.createVideoElement(f.variables.url)
                            videoNode.play()
                            this.wrapper.appendChild(videoNode)
                            break
                        }
                        default: {
                            throw new Error('unsupported fun group element type')
                        }
                    }
                }
                break
            }
            default: {
                throw new Error('tried to run fun with invalid type')
            }
        }
    }
}

class FunButton {
    constructor(duration, text, id) {
        this.type = FunTypes.Button
        this.duration = duration
        this.onClickListeners = []
        this.variables = {
            text: text,
            id: id
        }
    }

    onClick() {
        console.log('clicked')
        for (let cb of this.onClickListeners) {
            cb(this)
        }
    }

    addOnClickListener(cb) {
        this.onClickListeners.push(cb)
    }

    static deserialize(obj) {
        if (obj.t != FunTypes.Button) {
            throw new Error('tried to deserialize not button fun')
        }
        return new FunButton(obj.d, obj.v.t, obj.v.i)
    }

    static serialize(funButton) {
        return JSON.stringify({
            t: funButton.type,
            d: funButton.duration,
            v: {
                t: funButton.variables.text,
                i: funButton.variables.id
            }
        })
    }
}

class FunColor {

    constructor(duration, color) {
        this.type = FunTypes.Color
        this.duration = duration
        this.variables = {
            color: color
        }
    }

    static deserialize(obj) {
        if (!obj.t == FunTypes.color) {
            throw new Error('deserialize not color fun')
        }
        return new FunColor(obj.d, obj.v.c)
    }

    static serialize(funColor) {
        JSON.stringify({
            t: funColor.type,
            v: {
                c: funColor.variables.color
            },
            d: funColor.duration
        })
    }
}

class FunImage {
    constructor(duration, url) {
        this.type = FunTypes.Image
        this.duration = duration
        this.variables = {
            url: url
        }
    }

    static deserialize(obj) {
        if (obj.t != FunTypes.Image) {
            throw new Error('try to deserialize not image fun')
        }

        return new FunImage(obj.d, obj.v.u)
    }
}

class FunSound {
    constructor(duration, url) {
        this.type = FunTypes.Sound
        this.duration = duration
        this.variables = {
            url: url
        }
    }

    static deserialize(obj) {
        if (obj.t != FunTypes.Sound) {
            throw new Error('try to deserialize not sound fun')
        }

        return new FunSound(obj.d, obj.v.u)
    }
}

class FunVideo {
    constructor(duration, url) {
        this.type = FunTypes.Video
        this.duration = duration
        this.variables = {
            url: url
        }
    }

    static deserialize(obj) {
        if (obj.t != FunTypes.Video) {
            throw new Error('tried to deserialize not video fun')
        }

        return new FunVideo(obj.d, obj.v.u)
    }
}

class FunGroup {
    constructor(duration, funs) {
        this.type = FunTypes.Group
        this.duration = duration
        this.funs = funs
    }

    static deserialize(obj, socket) {
        if (obj.t != FunTypes.Group) {
            throw new Error('try to deserialize not group fun')
        }

        const funs = []
        // fl = fun list
        for (let fun of obj.fl) {
            funs.push(serverFunToOurFun(fun, socket))
        }
        return new FunGroup(obj.d, funs)
    }
}

class Command {

    constructor(object, socket) {
        this.object = object
        this.socket = socket

        this.type = this.object.t
    }

    parseCommandFun() {
        switch (this.type) {
            case CommandTypes.Fun: {
                // object.f.t = object.fun.type
                return serverFunToOurFun(this.object.f, this.socket)
            }
        }
    }
}

function serverFunToOurFun(fun, socket) {

    switch (fun.t) {
        case FunTypes.Button: {

            const funBtn = FunButton.deserialize(fun)
            funBtn.addOnClickListener(() => {
                socket.emit('bc', { i: funBtn.variables.id })
            })
            return funBtn
        }
        case FunTypes.Color: {
            return FunColor.deserialize(fun)
        }
        case FunTypes.Image: {
            return FunImage.deserialize(fun)
        }
        case FunTypes.Group: {
            return FunGroup.deserialize(fun, socket)
        }
        case FunTypes.Sound: {
            return FunSound.deserialize(fun)
        }
        case FunTypes.Video: {
            return FunVideo.deserialize(fun)
        }
        default: {
            throw new Error('command error: invalid fun type')
        }
    }
}

var socket = io();
const wrapper = document.getElementById('main-wrapper')
var funGenerator = new FunGenerator(wrapper)

funGenerator.start()

// r-c = random-color
socket.on('r-c', () => {

    funGenerator.append(new FunColor(1000, getRandomColor()))
})

// c = command
socket.on('c', msg => {
    var cmd = new Command(msg, socket)

    if (cmd.type == CommandTypes.ReloadPage) {

        window.location.reload()
    } else if (cmd.type == CommandTypes.ResumeGenerator) {

        funGenerator.resumeAfterInfinite()
    } else if (cmd.type == CommandTypes.Fun) {

        const fun = cmd.parseCommandFun()
        funGenerator.append(fun)
    }
})

