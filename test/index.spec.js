const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../index.js')
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
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true
    }

    beforeEach((done) => {
        // setup for 2 client connections...
        socket1 = socket_client.connect(url, options)
        socket2 = socket_client.connect(url, options)
        socket1.on('connect', () => {
            console.log('client 1 connected ok!')
                // done()
        })
        socket2.on('connect', () => {
            console.log('client 2 connected ok!')
            done()
        })
        socket1.on('disconnect', () => console.log('client 1 disconnected ok!'))
        socket2.on('disconnect', () => console.log('client 2 disconnected ok!'))
    })

    afterEach((done) => {
        // teardown for 2 client connections
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

    it('tells a user when she has joined successfully', (done) => {
        const firstUser = { 'name': 'erin' }
        const name = firstUser.name
        socket1.emit('user joined chat', name)
        console.log()

        // getElementById('.messages').should.contain(`You\'ve joined as ${name}`)
        done()
    })
})


// tests:
// empty form input? display message to user to enter a message
// no name entered in username prompt? display message to user to enter a username
// test two clients can connect and emit to each other
// test 'you've joined as' welcome message
// when user is typing?