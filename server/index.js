const app = require('express')();
const server = require('http').createServer(app);
const options = {cors: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://192.168.2.46:3000', 
    'http://192.168.2.186:3000',
    '*'
]};
const io = require('socket.io')(server, options);
const cors = require('cors');

let socket;
app.use(cors());
let cnt = 1;

io.on('connection', (_socket) => {
    socket = _socket;
    console.log('Connected');

    socket.on('coords-send', (data) => {
        socket.emit('coords-receive', JSON.stringify(JSON.parse(data)));
    });

    socket.on('disconnect', () => {
        console.log(`Disconnected - ${cnt}`);
        cnt += 1;
    });
});

server.listen(4000, () => {
    console.log('Listening on port 4000'); 
});