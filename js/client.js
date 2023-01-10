const socket = io.connect('http://127.0.0.1:8000');

// Getting DOM elements in respective JS variables
const form = document.getElementById('sendcontainer');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Audio that will play on recieving messages
var audio = new Audio('ding.mp3');

// Function which will append messages to the container
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left')
    {
        audio.play();
    }
}


// Ask user to add his/her name and let the server know
const name= prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// If a new user join, receive the event from server
socket.on('user-joined', name=>{
    append(`${name} joined the chat`, 'right');
})

socket.on('receive', data=>{
    append(`${data.name}: ${data.message}`, 'left');
})

// If a user leaves the chat, append the info to the container
socket.on('left', name=>{
    append(`${name} left the chat`, 'right')
})

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
})