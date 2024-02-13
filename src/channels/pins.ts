import service from "../service";
import path from "path";
import redis from "../lib/redis";
import { tr } from "date-fns/locale";

function pins(io: any, socket: any) {
  // socket.on("frame-join", (data: any, callback: any) => {
  //   service.pins.frameJoin(io, socket, data, callback);
  // });
  // socket.on("update-pin", (data: any, callback: any) => {
  //   service.pins.updatePinService(io, socket, data, callback);
  // });

  // socket.on("close-pin", (data: any, callback: any) => {
  //   service.pins.closePinService(io, socket, data, callback);
  // });

  // // split the channels

  // socket.on("join-pin", (data: any, callback: any) => {
  //   service.pins.joinPinService(io, socket, data, callback);
  // });

  // socket.on("character-move", (data: any, callback: any) => {
  //   service.pins.characterMove(io, socket, data, callback);
  // });

  // socket.on("master-cursor-position", (data: any, callback: any) => {
  //   service.pins.masterCursorPosition(io, socket, data, callback);
  // });

  // socket find-reveal-state

  //  socket find-reveal-chalkboard-content

  // socket update-reveal-state

  //  socket update-reveal-chalkboard-content
  socket.on("join-client", (data: any, callback: any) => {});

  socket.on("join-master", (data: any, callback: any) => {});

  socket.on("find-reveal-stater", (data: any, callback: any) => {});

  socket.on("find-reveal-chalkboard-content", (data: any, callback: any) => {});

  socket.on("update-reveal-state", (data: any, callback: any) => {});

  socket.on(
    "update-reveal-chalkboard-content",
    (data: any, callback: any) => {}
  );
}
export default pins;
