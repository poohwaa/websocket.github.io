const socket = new WebSocket(`ws://${window.location.host}`);
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

socket.addEventListener("open", (ev) => {
  console.log("Connected to Server🖥");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
  // message type is blob from server
  //   const msgArr = JSON.parse(message.data).data;
  //   let newMsg = "";
  //   msgArr.forEach((element) => {
  //     newMsg += String.fromCharCode(element);
  //   });
  //   console.log("new message: " + newMsg);
});

socket.addEventListener("close", (ev) => {
  console.log("disconnected from server ✂", ev);
});

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  //   socket.send(input.value);
  input.value = "";
}

function handelNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  input.value = "";
  //   socket.send(input.value);
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handelNickSubmit);
