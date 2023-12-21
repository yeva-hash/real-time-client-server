const ws = require('ws');

const wss = new ws.Server({
    port: 5000
},  () => console.log('server started on port 5000'));

wss.on('connection', function connection(ws) {
    ws.id = Date.now();
    ws.on('message', function (message) {
        message = JSON.parse(message);
        switch (message.event) {
            case 'message':
                broadcastMessage(message)
                break;
            case 'connection':
                console.log(`User ${message.username} has been connected`)
                broadcastMessage(message)
                break;
            default:
                break;
        }
    })

    ws.on('error', console.error);
})

function broadcastMessage(message) {
    wss.clients.forEach(client => {
            client.send(JSON.stringify(message))
    })
}