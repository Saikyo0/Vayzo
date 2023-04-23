const socket = io('https://1485-196-188-160-89.ngrok-free.app', { cors: { origin: "*" } });
let roomID = '';

const form = document.getElementById('room-form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    roomID = document.getElementById('room-id').value;
    socket.emit('joinRoom', roomID);
});

const chat = document.getElementById('chat-form');
chat.addEventListener('submit', (event) => {
    event.preventDefault();
    text = document.getElementById('chat-input').value;
    document.querySelector('#chat-messages').innerHTML += '<div>'+text+'</div>'; 
    socket.emit('chat', {text, roomID})
});

const video = document.getElementById('my-video'); 
let lastSentTimestamp = 0; 
let isPaused = false;

video.addEventListener('play', () => {
if (isPaused) {
    socket.emit('play', roomID); 
    isPaused = false; 
    document.querySelector('#chat-messages').innerHTML += '<div>Play</div>'; 
} 
}); 

video.addEventListener('pause', () => {
    socket.emit('pause', roomID); 
    isPaused = true; 
    document.querySelector('#chat-messages').innerHTML += '<div>Pause</div>'; 
}); 

video.addEventListener('seek', () => {
    const timestamp = video.currentTime; 
    socket.emit('sync', { timestamp, roomID }); 
    lastSentTimestamp = timestamp; 
});

socket.on('play', (room) => { 
if (room === roomID && video.paused) {
    video.play(); 
    document.querySelector('#chat-messages').innerHTML += '<div>Play</div>'; 
} 
}); 

socket.on('pause', (room) => { 
if (room === roomID && !video.paused) { 
    video.pause(); 
    document.querySelector('#chat-messages').innerHTML += '<div>Pause</div>'; 
} 
}); 

const syncButton = document.getElementById('sync-button'); 
syncButton.addEventListener('click', () => { 
    const timestamp = video.currentTime; 
    socket.emit('sync', { timestamp, roomID }); 
    lastSentTimestamp = timestamp; 
}); 

const selectVideoButton = document.getElementById('select-video'); 
selectVideoButton.addEventListener('click', () => { 
    const fileInput = document.createElement('input'); 
    fileInput.type = 'file'; 
    fileInput.accept = 'video/*'; 
    fileInput.addEventListener('change', (event) => { 
        const file = event.target.files[0]; 
        const videoURL = URL.createObjectURL(file); 
        video.src = videoURL; 
    }); 
    fileInput.click(); 
});

socket.on('sync', (data) => { 
if (data.roomID === roomID) { 
    video.currentTime = data.timestamp; 
} 
}); 
