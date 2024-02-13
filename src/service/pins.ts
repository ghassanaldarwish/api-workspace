import redis, { createRedisModel, findRedisModel } from "../lib/redis";
import fs from "fs";
import path from "path";

export async function joinPinService(
  io: any,
  socket: any,
  data: any,
  callback: any
) {
  const { name, pin, clientId } = data;
  if (!pin || !clientId || !name) return;
  const roomId = pin;
  socket.join(roomId);
  console.log("joinPinService=> ", data);
  try {
    const getState = await findRedisModel(`reveal-state-${pin}`);
    // socket.to(pin).emit("update-pin", { state: getState});
    callback({ state: getState });
  } catch (error) {
    socket.to(pin).emit("error-pin", { error: "The pin already expired" });
    callback({ error: "The pin already expired" });
    console.log("joinPinService error=> ", error);
  }
}

export async function updatePinService(
  io: any,
  socket: any,
  data: any,
  callback: any
) {
  const { modelsKey, pin, pinId, state, content } = data;

  try {
    // if (state) {
    //   const getPin = await findRedisModel(pin);
    //   const newPin = { ...getPin, ...state };
    //   await createRedisModel(pin, newPin);
    // }

    // if (content) {
    //   const getPin = await findRedisModel(pin);
    //   const newPin = { ...getPin, content };
    //   await createRedisModel(pin, newPin);
    // }

    //const getPin = await findRedisModel(pin);

    //const lesson = await findRedisModel(getPin.lessonId);

    if (state && pin) {
      await createRedisModel(`reveal-state-${pin}`, state);
      const getState = await findRedisModel(`reveal-state-${pin}`);

      console.log("data=====>>>>> ", data, getState);
      //  socket.emit(pin, { state: getState });
      io.emit(pin + "-update-slides", { state: getState });
      callback({ state: getState });
    }
  } catch (error) {
    callback({ error: "The pin already expired" });
    console.log("joinPinService error=> ", error);
  }
}

export async function closePinService(
  io: any,
  socket: any,
  data: any,
  callback: any
) {
  const { modelsKey, pin, pinId } = data;

  redis.del(pin);
  io.to(pin).emit("close-pin", { pinId });
  callback({ pinId });
}

export async function frameJoin(
  io: any,
  socket: any,
  data: any,
  callback: any
) {
  const { pin } = data;
  if (!pin) return;
  const roomId = pin;
  socket.join(roomId);
  try {
    const getState = await findRedisModel(`reveal-state-${pin}`);
    //socket.to(pin).emit("update-pin", { state: getState });

    fs.readdir("workspaces/" + "dci" + "/workspace", (err, files) => {
      callback({ state: getState, files });
    });
  } catch (error) {
    socket.to(pin).emit("error-pin", { error: "The pin already expired" });
    callback({ error: "The pin already expired" });
    console.log("joinPinService error=> ", error);
  }
}
export async function characterMove(
  io: any,
  socket: any,
  data: any,
  callback: any
) {
  const { pin, position, clientId } = data;
  if (!pin || !position || !clientId) return;
  const roomId = pin;
  try {
    const getPin = await findRedisModel(roomId);
    const { participants } = getPin;
    const newParticipants = participants.map((participant: any) => {
      if (participant.clientId === clientId) {
        participants.position = position;
      }
      return participant;
    });

    getPin.participants = newParticipants;
    await createRedisModel(pin, getPin);
    const lastPin = await findRedisModel(roomId);

    io.to(roomId).emit("update-pin", { pin: lastPin });

    callback({ pin: lastPin });
  } catch (error) {
    //socket.to(pin).emit("error-pin", { error: "The pin already expired" });
    callback({ error: "The pin already expired" });
    console.log("joinPinService error=> ", error);
  }
}

/**
 export async function joinPinService(
  io: any,
  socket: any,
  data: any,
  callback: any
) {
  const { name, pin, clientId } = data;
  if (!pin || !clientId || !name) return;
  const roomId = pin;
  socket.join(roomId);
  console.log("joinPinService=> ", data);
  try {
    const getState = await findRedisModel(`reveal-state-${pin}`);
    const { participants } = getPin;
    const findParticipant = participants.find(
      (p: any) => p.clientId === clientId
    );

    function randomPosition(min = -4, max = 4) {
      // min and max included
      return Math.random() * (max - min + 1) + min;
    }
    const generateRandomPosition = () => {
      return [randomPosition(), 0, randomPosition()];
    };

    const generateRandomHexColor = () => {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    };
    if (!findParticipant) {
      getPin.participants.push({
        ...data,
        position: generateRandomPosition(),
        hairColor: generateRandomHexColor(),
        topColor: generateRandomHexColor(),
        bottomColor: generateRandomHexColor(),
      });
      await createRedisModel(pin, getPin);
    }

    socket.to(pin).emit("update-pin", { pin: getPin, clientUser: data });

    callback({ pin: getPin, clientUser: data });
  } catch (error) {
    socket.to(pin).emit("error-pin", { error: "The pin already expired" });
    callback({ error: "The pin already expired" });
    console.log("joinPinService error=> ", error);
  }
}
 */
