const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8183 });

let loginuser = {};

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    let parsedmessage = JSON.parse(message);
    let userid = parsedmessage.pingid;

    if (message != "{}") {
      if (userid != null) {
        loginuser[userid] = ws;
      } else {
        let socket = loginuser[parsedmessage.id];
        if (typeof parsedmessage.data === "string") {
          console.log(parsedmessage.data);
          socket.send(parsedmessage.data);
        } else {
          console.log(parsedmessage.data);
          if (socket != null && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(parsedmessage.data));
          }
        }
      }
    }
  });
});
