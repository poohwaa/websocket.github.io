import express from "express";
import http from "http";
// import WebSocket from "ws";
import SocketIO from "socket.io";
// import { Server } from "socket.io";
// import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

// http server
const httpServer = http.createServer(app);
// web socket server
const wsServer = SocketIO(httpServer);
// const wss = new WebSocket.Server({ server });
// const wsServer = new Server(httpServer, {
//   cors: {
//     origin: ["https://admin.socket.io"],
//     credentials: true,
//   },
// });

// instrument(wsServer, {
//   auth: false,
// });

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

// const sockets = [];

// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anon";
//   console.log("connected to Browser 📲");

//   socket.on("close", () => {
//     console.log("disconnected from Browser ✂");
//   });

//   socket.on("message", (message) => {
//     const msg = JSON.parse(message);
//     const payloadStr = msg.payload.toString("utf8");
//     switch (msg.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket["nickname"]}: ${payloadStr}`)
//         );
//         break;
//       case "nickname":
//         socket["nickname"] = payloadStr;
//         break;
//     }
//   });
// });

const handelListen = () => console.log("Listening On http://localhost:3000");
httpServer.listen(3000, handelListen);
