const chatForm = document.querySelector('form')
const message = document.querySelector('#message')
const messages = document.querySelector('.messages')
const name = prompt('What is your name? ', '')
const socket = io.connect('http://localhost:3000')

const newMessage = (message) => {
    const li = document.createElement('li')
    li.innerHTML = message
    messages.appendChild(li)
}

newMessage(`Welcome, ${name}!`)

socket.emit('user joined chat', name)

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    socket.emit('chat message', { message: message.value })

    message.value = ''
    return false
}, false)

socket.on('chat message', (msg) => {
    newMessage(`${msg.name}: ${msg.message}`)
})

socket.on('user joined chat', (msg) => {
    newMessage(msg.message)
})