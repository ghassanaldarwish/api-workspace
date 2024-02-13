import service from "../service";

function studio(io: any, socket: any) {
  socket.on("join-studio", (data: any, callback: any) => {
    service.studio.joinStudioService(io, socket, data, callback);
  });

  socket.on("monaco-editor-studio", (data: any, callback: any) => {
    service.studio.monacoEditorStudioService(io, socket, data, callback);
  });
}
export default studio;
