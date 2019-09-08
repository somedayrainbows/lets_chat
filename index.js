const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000

app.use("/public", express.static(__dirname + "/public"))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    console.log(`client ${socket.id} connected`)

    socket.on('chat message', function(msg) {
        msg.name = this.name
        io.emit('chat message', msg)
    })

    socket.on('user joined chat', function(name) {
        this.name = name
        socket.broadcast.emit('user joins chat', name)
    })
})

server.listen(port, () => {
    console.log(`server listening on port ${port}`)
})


module.exports = server