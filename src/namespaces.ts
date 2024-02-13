import channels from "./channels";

const namespaces = async (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
  const live_share_namespace = io.of("/live-share");
  const workspace_namespace = io.of("/workspace");

  live_share_namespace.on("connection", (socket: any) => {
    console.log("a user connected live_share_namespace");
    channels.liveShare(io, live_share_namespace, socket);
  });
  workspace_namespace.on("connection", (socket: any) => {
    console.log("a user connected workspace_namespace");
    channels.workspace(io, workspace_namespace, socket);
  });
  // io.on("connection", (socket: any) => {
  //   const auth = socket.handshake.auth;

  //   socket.broadcast.emit("member_connect_channel", "world");

  //   socket.on("disconnect", () => {
  //     socket.broadcast.emit("member_disconnect_channel", "disconnect world");
  //   });
  // });

  // io.on("connection", (socket: any) => {
  //   const auth = socket.handshake.auth;

  //   console.log(auth.token);
  //   if (auth.token === "239rfaiskdfvq243EGa4q3wefsdad") {
  //     //valid nodeClient
  //     //   socket.join("nodeClient"); //this client is a nodeClient, put in appropriate room
  //     channels.studio(io, socket);
  //     channels.pins(io, socket);
  //   } else if (auth.token === "23jrtiheriufyqwidsf") {
  //     channels.studio(io, socket);
  //     channels.pins(io, socket);
  //     //this client is a reactClient, put in appropriate room
  //   } else {
  //     //you do not belong here. Go away!
  //     socket.disconnect();
  //     console.log("YOU HAVE BEEN DISCONNECTED!!!");
  //   }
  //   console.log(`Someone connected on worker ${process.pid}`);
  //   socket.emit("welcome", "Welcome to our production driven socket.io server!");
  // });
};

export default namespaces;
