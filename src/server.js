import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handelListen = () => console.log("Listening On http://localhost:3000");

// http server
const server = http.createServer(app);
// web socket server
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("connected to Browser 📲");

  socket.on("close", () => {
    console.log("disconnected from Browser ✂");
  });

  socket.on("message", (message) => {
    const msg = JSON.parse(message);
    const payloadStr = msg.payload.toString("utf8");
    switch (msg.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket["nickname"]}: ${payloadStr}`)
        );
        break;
      case "nickname":
        socket["nickname"] = payloadStr;
        break;
    }
  });
});

server.listen(3000, handelListen);
