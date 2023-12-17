const socket = io();

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");
const room = document.getElementById("room");
const nickname = document.getElementById("nickname");
const nameForm = nickname.querySelector("#name");

let roomName = "";

welcome.hidden = true;
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

function showInputRoomName() {
  nickname.hidden = true;
  welcome.hidden = false;
  welcomeForm.addEventListener("submit", handleRoomSubmit);
}

function handleNameSubmit(event) {
  event.preventDefault();
  const input = nameForm.querySelector("input");
  const inputVal = input.value;
  socket.emit("nickname", inputVal, showInputRoomName);
}

nameForm.addEventListener("submit", handleNameSubmit);

function changeRommTile(roomName, userCnt) {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName} (${userCnt})`;
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

function addMessage(msg) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

socket.on("welcome", (nickname, newUserCnt) => {
  changeRommTile(nickname, newUserCnt);
  addMessage(`${nickname} joined~`);
});

socket.on("bye", (nickname, newUserCnt) => {
  changeRommTile(nickname, newUserCnt);
  addMessage(`${nickname} left. see ya~`);
});

socket.on("new_message", (msg) => {
  addMessage(msg);
});

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.appendChild(li);
  });
});
