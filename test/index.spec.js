const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../index')
const socket_client = require('socket.io-client')
const socket_server = require('socket.io').listen(3001);

chai.use(chaiHttp)

describe('Root page test', () => {
    it('should return the root page with title and form', () => {
        return chai.request(server)
            .get('/')
            .then((response) => {
                response.should.have.status(200)
                response.should.be.html
                response.text.should.contain("Let's Chat!")
                response.text.should.contain("send message")
            })
            .catch((error) => {
                throw error
            })
    })

    it('should return a 404 for a path that does not exist', () => {
        return chai.request(server)
            .get('/nonexistent')
            .then((response) => {
                response.should.have.status(404);
            })
            .catch((error) => {
                throw error;
            });
    });
})

describe('Socket tests', () => {
    let client
    const url = 'http://localhost:3001'
    const options = {
        transports: ['websocket'],
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true
    }

    beforeEach((done) => {
        // setup for two client connections...
        socket1 = socket_client.connect(url, options)
        socket2 = socket_client.connect(url, options)
        socket1.on('connect', () => {
            console.log('client 1 connected ok!')
        })
        socket2.on('connect', () => {
            console.log('client 2 connected ok!')
            done()
        })
        socket1.on('disconnect', () => console.log('client 1 disconnected ok!'))
        socket2.on('disconnect', () => console.log('client 2 disconnected ok!'))
    })

    afterEach((done) => {
        // teardown for both client connections
        if (socket1.connected) {
            console.log('disconnecting client 1...')
            socket1.disconnect()
        } else {
            console.log('client 1 isn\'t connected!')
        }
        if (socket2.connected) {
            console.log('disconnecting client 2...')
            socket2.disconnect()
        } else {
            console.log('client 2 isn\'t connected!')
        }
        done()
    })

    it('server can connect', () => {
        socket_server.on('connection', (socket) => {
            socket.should.not.be.null
        })
    })

    it('server can emit a message', (done) => {
        socket_server.emit('message', 'This is a message!')

        socket1.once('message', (message) => {
            message.should.equal('This is a message!')
            done()
        })
    })

    it('announces to a connected user when someone else joins the chat', (done) => {
        const name = 'erin'

        socket_server.emit('user joined chat', { message: `${name} just joined this chat` })

        socket1.on('user joined chat', (msg) => {
            msg.message.should.equal('erin just joined this chat')
        })
        socket2.on('user joined chat', (msg) => {
            msg.message.should.equal('erin just joined this chat')
            done()
        })
    })
    it('sends chat', (done) => {
        let message = { value: 'Hey hey!' }

        socket_server.emit('chat message', message.value)

        socket2.on('chat message', (msg) => {
            msg.should.equal('Hey hey!')
            done()
        })
    })
})


// tests:
// empty form input? display message to user to enter a message
// no name entered in username prompt? display message to user to enter a username
// test two clients can connect and emit to each other
// test 'user just joined' message
// test welcome message when user connection successful
// test when user is typing (and implement)