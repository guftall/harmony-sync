var socket = io();

const topic = 'haji-bd'

const funs = []

const FunTypes = {
    Button: 'b',
    Color: 'c',
}

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
            execute: onExecuteQueueFun
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
                buttonNode.onclick = fun.variables.onClick

                backgroundDiv.appendChild(buttonNode)
                this.wrapper.appendChild(backgroundDiv)
                break
            }
        }
    }
}


class FunButton {
    constructor(duration, text, onClick) {
        this.type = FunTypes.Button
        this.duration = duration
        this.variables = {
            text: text,
            onClick: onClick
        }
    }

    static deserialize(string, onClick) {
        const fb = JSON.parse(string)
        if (fb.t != FunTypes.Button) {
            throw new Error('tried to deserialize not button fun')
        }
        return new FunButton(fb.d, fb.v.t, onClick)
    }

    static serialize(funButton) {
        return JSON.stringify({
            t: funButton.type,
            d: funButton.duration,
            v: {
                t: funButton.variables.text
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

    static deserialize(string) {
        var obj = JSON.parse(string)
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

const wrapper = document.getElementById('main-wrapper')
var funGenerator = new FunGenerator(wrapper)

funGenerator.append(new FunColor(500, '#2499ff'))
funGenerator.append(new FunColor(500, '#120da3'))
funGenerator.append(new FunColor(500, '#bf1f67'))
funGenerator.append(new FunColor(500, '#1fbf8f'))
funGenerator.append(new FunColor(500, '#e6cd2c'))

funGenerator.start()


socket.on(topic, msg => {
    console.log('topic: ', topic)
    console.log('message: ', msg)

    funGenerator.append(new FunColor(1000, getRandomColor()))
})

function buttonClicked(userId) {
    // bc = ButtonClicked
    socket.emit('bc', { i: userId })
    funGenerator.resumeAfterInfinite()
}

const FunSobhanButton = new FunButton(0, 'سبحان', () => {
    buttonClicked(1)
})
const FunMamdaliButton = new FunButton(0, 'محمد علی', () => {
    buttonClicked(2)
})
const FunMojButton = new FunButton(0, 'مجتبی', () => {
    buttonClicked(3)
})
const FunParsaButton = new FunButton(0, 'پارسا', () => {
    buttonClicked(4)
})
const FunRezaButton = new FunButton(0, 'رضا', () => {
    buttonClicked(5)
})
const FunHajiButton = new FunButton(0, 'حاجی', () => {
    buttonClicked(6)
})

funGenerator.append(FunSobhanButton)
funGenerator.append(FunMamdaliButton)
funGenerator.append(FunMojButton)
funGenerator.append(FunParsaButton)
funGenerator.append(FunRezaButton)
funGenerator.append(FunHajiButton)
