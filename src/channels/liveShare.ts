import service from "../service";

function liveShare(io: any, ns: any, socket: any) {
  socket.on("join-studio", (data: any, callback: any) => {
    service.studio.joinStudioService(io, socket, data, callback);
  });
}
export default liveShare;
