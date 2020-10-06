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

        function onHandleNextFun() {
            if (that.funQueue.length == 0) {
                that.currenExecuting = undefined
                console.log('empty fun queue')
                return
            }

            const fun = that.funQueue.splice(0, 1)[0]
            that.currenExecuting = fun

            fun.startedAt = new Date()

            // set timeout so we execute next job when this job finished
            fun.timeref = setTimeout(() => {
                fun.finishedAt = new Date()
                onHandleNextFun()
            }, fun.fun.duration)

            that.runFun.bind(that)(fun.fun)
        }

        this.funQueue.push({
            createdAt: new Date(),
            fun: fun,
            run: onHandleNextFun
        })

        if (this.started && this.currenExecuting == undefined) {
            this.funQueue[0].run()
        }
    }

    start() {
        if (this.started) {
            throw new Error('fun generator already started')
        }
        this.started = true

        this.funQueue[0].run()
    }

    runFun(fun) {
        console.log('run fun:', fun)
        switch (fun.type) {
            case FunTypes.Color: {
                var colorNode = document.createElement('div')
                colorNode.style.backgroundColor = fun.variables.color
                colorNode.style.height = '100%'
                colorNode.style.width = '100%'

                $(this.wrapper).children().remove()
                this.wrapper.appendChild(colorNode)
                break
            }
            case FunTypes.Button: {

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

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
