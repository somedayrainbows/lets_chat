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

    it('should return a 404 for a path that not exist', () => {
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
    const firstUser = { 'username': 'erinb' }

    beforeEach((done) => {
        // only one client joining...
        client = socket_client.connect(url, options)
        client.on('connect', () => {
            console.log('client connected ok!')
            done()
        })
        client.on('disconnect', () => console.log('client disconnected ok!'))
    })

    afterEach((done) => {
        if (client.connected) {
            console.log('disconnecting client...')
            client.disconnect()
        } else {
            console.log('there isn\'t a connection to disconnect!')
        }
        done()
    })

    it('server can emit a message', (done) => {
        socket_server.emit('message', 'This is a message!')

        client.once('message', (message) => {
            message.should.equal('This is a message!')
            done()
        })

        socket_server.on('connection', (socket) => {
            // console.log(socket)
            socket.should.not.be.null
        })
    })

    xit('announces when a user joins', (done) => {

        done()
    })
})


// tests:
// empty form input? display message to user to enter a message
// no name entered in username prompt? display message to user to enter a username
// test two clients can connect and emit to each other
// test 'you've joined as' welcome message
// when user is typing?