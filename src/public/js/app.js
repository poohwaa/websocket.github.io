const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

let roomName = "";

room.hidden = true;

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const inputVal = input.value;
  socket.emit("new_message", inputVal, roomName, () => {
    addMessage(`You: ${inputVal}`);
  });
  input.value = "";
}

function handleNameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  const inputVal = input.value;
  socket.emit("nickname", inputVal, roomName);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
  const nameForm = room.querySelector("#name");
  nameForm.addEventListener("submit", handleNameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

function addMessage(msg) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

socket.on("welcome", (nickname) => {
  addMessage(`${nickname} joined~`);
});

socket.on("bye", (nickname) => {
  addMessage(`${nickname} left. see ya~`);
});

socket.on("new_message", (msg) => {
  addMessage(msg);
});
