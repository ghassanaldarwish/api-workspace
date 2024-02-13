import redis, { createRedisModel, findRedisModel } from "../lib/redis";
import chokidar from "chokidar";
import fs from "fs";
import path from "path";

chokidar.watch("workspaces/dci/workspace").on("all", (event, path) => {
  console.log("chokidar  ====> ", event, path);
});

fs.readdir("workspaces/dci/workspace", (err, files) => {
  console.log("fs.readdir =====>>>>>> ", files);
});

export async function joinStudioService(
  io: any,
  socket: any,
  data: any,
  callback: any
) {
  const { folderId, modelsKey, repositoryId, file } = data;
  const roomId = modelsKey + "-" + folderId + "-" + repositoryId;
  socket.join(roomId);
  const fPath = path.resolve(
    "repositories/" +
      modelsKey +
      "/" +
      folderId +
      "/" +
      repositoryId +
      "/" +
      file
  );

  const ws_fPath = path.resolve("workspaces/" + modelsKey + "/workspace");
  fs.readFile(fPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);

      socket.to(roomId).emit(`error-studio`, err.message);
    } else {
      callback(data);
    }
  });
}

export async function monacoEditorStudioService(
  io: any,
  socket: any,
  data: any,
  callback: any
) {
  const { folderId, modelsKey, repositoryId, file, content } = data;
  const roomId = modelsKey + "-" + folderId + "-" + repositoryId;

  const fPath = path.resolve(
    "repositories/" +
      modelsKey +
      "/" +
      folderId +
      "/" +
      repositoryId +
      "/" +
      file
  );

  const isExist = fs.existsSync(fPath);

  console.log("monacoEditorStudioService ====> ", data, fPath);
  if (isExist) {
    fs.writeFile(fPath, content, "utf8", function (err) {
      if (err) {
        console.error("Error reading file:", err);

        socket.to(roomId).emit(`error-studio`, err.message);
      } else {
        // callback(content);
        socket.to(roomId).emit(`update-studio`, content);
      }
    });
  }
}
