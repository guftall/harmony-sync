
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const FunTypes = {
    Button: 'b',
    Color: 'c',
    Image: 'i',
    Sound: 's',
    Group: 'g'
}

const CommandTypes = {
    ReloadPage: 'r',
    ResumeGenerator: 'g',
    Fun: 'f',
}