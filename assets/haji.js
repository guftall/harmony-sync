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

        this.funQueue[0].execute()
    }

    runFun(fun) {
        console.log('run fun:', fun)
        $(this.wrapper).children().remove()
        switch (fun.type) {
            case FunTypes.Color: {
                var colorNode = document.createElement('div')
                colorNode.style.backgroundColor = fun.variables.color
                colorNode.style.height = '100%'
                colorNode.style.width = '100%'

                this.wrapper.appendChild(colorNode)
                break
            }
            case FunTypes.Button: {

                var backgroundDiv = document.createElement('div')
                backgroundDiv.style.backgroundColor = '#c3e3cb';
                backgroundDiv.style.height = '100%'
                backgroundDiv.style.width = '100%'
                backgroundDiv.style.display = 'flex'

                var buttonNode = document.createElement('button')
                buttonNode.innerHTML = fun.variables.text
                buttonNode.style.width = '100px'
                buttonNode.style.height = '60px'
                buttonNode.style.margin = 'auto auto'
                buttonNode.classList.add("btn", "btn-info")
                buttonNode.onclick = fun.onClick.bind(fun)

                backgroundDiv.appendChild(buttonNode)
                this.wrapper.appendChild(backgroundDiv)
                break
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

class Command {

    constructor(object) {
        this.object = object

        this.type = this.object.t
    }

    parseFun() {
        switch (this.type) {
            case CommandTypes.Fun: {
                // object.f.t = object.fun.type
                switch (this.object.f.t) {
                    case FunTypes.Button: {

                        const funBtn = FunButton.deserialize(this.object.f)
                        funBtn.addOnClickListener(() => {
                            socket.emit('bc', { i: funBtn.variables.id })
                        })
                        return funBtn
                    }
                    case FunTypes.Color: {
                        return FunColor.deserialize(this.object.f)
                    }
                }
            }
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
    var cmd = new Command(msg)

    if (cmd.type == CommandTypes.ReloadPage) {

        window.location.reload()
    } else if (cmd.type == CommandTypes.ResumeGenerator) {

        funGenerator.resumeAfterInfinite()
    } else if (cmd.type == CommandTypes.Fun) {

        const fun = cmd.parseFun()
        funGenerator.append(fun)
    }
})

