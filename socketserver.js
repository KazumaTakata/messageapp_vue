const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8183 });

let loginuser = {};

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    let parsedmessage = JSON.parse(message);
    let userid = parsedmessage.pingid;
    let member = parsedmessage.member;
    let senderid = parsedmessage.senderid;

    if (message != "{}") {
      if (member != undefined) {
        let returnobj = [];
        member.map(m => {
          if (loginuser[m] != undefined) {
            returnobj.push(m);
          }
        });
        ws.send(JSON.stringify({ type: "loginuser", loginuser: returnobj }));
      } else {
        if (userid != null) {
          console.log("ping from", userid);
          loginuser[userid] = ws;
        } else {
          let socket = loginuser[parsedmessage.id];
          if (senderid != undefined) {
            socket.send(message);
          } else {
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
      }
    }
  });
});
