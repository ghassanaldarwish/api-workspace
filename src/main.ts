import channels from "./channels";
import liveShare from "./channels/liveShare";
import redis, { createRedisModel, findRedisModel } from "./lib/redis";
import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import slugify from "slugify";

const token = "23jrtiheriufyqwidsf";

const session: any = {
  token,
  folderId: "4f0f8ad18904bdeb90cc799",
  repositoryId: "64f0f8c058ab9b207099e886",
  workspace: "dci",
  fileName: "README.md",
};

const formatStringReducer = (accumulator: any, element: any, index: number) => {
  accumulator += `.slide.webdrei.pins. \n`;
  const splitByBlock = element.split("\n");

  for (let i = 0; i < splitByBlock.length; i++) {
    const block = splitByBlock[i];

    if (block) {
      accumulator += block;
      accumulator += "\n\n";
    } else {
      accumulator += "\n\n";
    }
  }

  return accumulator;
};

const getFolderFs = (filePath: string) => {
  const isExist = fs.existsSync(filePath);
  if (!isExist) return null;

  const files: any = [];

  const readDir = fs.readdirSync(filePath);

  if (!readDir) return files;

  if (readDir.length === 0) return files;

  for (let i = 0; i < readDir.length; i++) {
    const file = readDir[i];
    const fileP = path.resolve(filePath, file);
    const isFile = fs.lstatSync(fileP);

    if (isFile.isFile()) {
      files.push({
        type: "file",
        endPoint: fileP,
        name: file,
      });
    } else {
      files.push({
        type: "folder",
        endPoint: fileP,
        name: file,
        folders: getFolderFs(fileP),
      });
    }
  }
  return files;
};

const buildWsFiles = (files: any, wsDir: string) =>
  files.map((file: any) => {
    const filePath = path.resolve(wsDir, file);
    const isFile = fs.lstatSync(filePath);

    if (isFile.isFile()) {
      return {
        type: "file",
        endPoint: filePath,
        name: file,
      };
    } else {
      return {
        type: "folder",
        endPoint: filePath,
        name: file,
        folders: getFolderFs(filePath),
      };
    }
  });

const createId = (str: string, index: number) =>
  slugify(str.slice(0, 25)) + "-" + index;

const createInnerText = (str: string, pattern: string) =>
  str.replace(/\n/g, " ").replace(pattern, "").trim();

const typesMap = (elStart: string, index: number) => {
  if (elStart.startsWith("######")) {
    const innerText = createInnerText(elStart, "######");

    const id = createId(innerText, index);

    return { type: "heading", text: innerText, id, level: 6 };
  }

  if (elStart.startsWith("#####")) {
    const innerText = createInnerText(elStart, "#####");

    const id = createId(innerText, index);

    return { type: "heading", text: innerText, id, level: 5 };
  }
  if (elStart.startsWith("####")) {
    const innerText = createInnerText(elStart, "####");

    const id = createId(innerText, index);

    return { type: "heading", text: innerText, id, level: 4 };
  }
  if (elStart.startsWith("###")) {
    const innerText = createInnerText(elStart, "###");

    const id = createId(innerText, index);

    return { type: "heading", text: innerText, id, level: 3 };
  }

  if (elStart.startsWith("##")) {
    const innerText = createInnerText(elStart, "##");

    const id = createId(innerText, index);

    return { type: "heading", text: innerText, id, level: 2 };
  }
  if (elStart.startsWith("#")) {
    const innerText = createInnerText(elStart, "#");

    const id = createId(innerText, index);

    return { type: "heading", text: innerText, id, level: 1 };
  }

  if (elStart.startsWith("![")) {
    const arr = elStart.trim().split("](");
    const src = arr[1].replace(")", "").trim();
    const alt = arr[0].replace("![", "").trim();
    const id = createId(elStart, index);
    return { type: "image", src, id, alt, text: alt };
  }

  if (elStart.startsWith("```")) {
    const innerText = createInnerText(elStart, "```");
    const id = createId(elStart, index);
    const language = innerText.slice(0, 20).trim();
    return { type: "code", id, text: innerText, inline: false, language };
  }

  if (elStart.startsWith("`")) {
    const innerText = createInnerText(elStart, "`");
    const id = createId(elStart, index);

    return { type: "code", id, text: innerText, inline: true };
  }

  if (elStart.startsWith(">")) {
    const innerText = createInnerText(elStart, ">");
    const id = createId(elStart, index);
    return { type: "blockquote", id, text: innerText };
  }

  if (elStart.startsWith("[")) {
    const arr = elStart.trim().split("](");
    const href = arr[1].replace(")", "").trim();
    const title = arr[0].replace("[", "").trim();
    const id = createId(elStart, index);
    return { type: "link", href, id, title, target: "_blank", text: title };
  }
  // if (elStart.startsWith(">")) {
  //   return "blockquote";
  // }
  // if (elStart.startsWith("####")) {
  //   return "h4";
  // }

  // if (elStart.startsWith("#####")) {
  //   return "h5";
  // }

  // if (elStart.startsWith("######")) {
  //   return "h6";
  // }

  // if (elStart.startsWith("![")) {
  //   return "image";
  // }

  // if (elStart.startsWith("[")) {
  //   return "link";
  // }

  // if (elStart.startsWith("```")) {
  //   return "block-code";
  // }

  // if (elStart.startsWith("`")) {
  //   return "inline-code";
  // }

  // if (elStart.startsWith(">")) {
  //   return "blockquote";
  // }

  const id = createId(elStart, index);

  return { type: "paragraph", text: elStart, id };
};

const daltaMap = (raw: string, index: number) => {
  const props = typesMap(raw.trim().replace(/\n/g, ""), index);

  const block = { raw, index, ...props };

  return block;
};

const participants: any = [];
const socketMain = async (io: any) => {
  const live_share_namespace = io.of("/live-share");

  live_share_namespace.on("connection", (socket: any) => {
    // chokidar.watch("workspaces/dci/workspace").on("all", (event, path) => {
    //   console.log("chokidar  ====> ", event, path);

    //   live_share_namespace.emit("chokidar_workspase_updated", { event, path });
    // });
    //liveShare(live_share_namespace, socket);

    // const room = "live-share";
    // socket.join(room);

    // const cookie = socket.handshake.headers.cookie;

    // const cookies = cookie.split("; ");

    // const credentials = cookies.reduce((acc: any, cookie: string) => {
    //   const [key, value] = cookie.split("=");

    //   acc[key] = value;

    //   return acc;
    // }, {});

    const cookie = socket.handshake.headers.cookie || "; ";

    //if (!cookie) return;

    const cookies = cookie.split("; ");

    const credentials = cookies.reduce((acc: any, cookie: string) => {
      const [key, value] = cookie.split("=");

      acc[key] = value;

      return acc;
    }, {});
    //const { id, token, userName, workspace } = credentials;

    const { id, token, userName, workspace } = {
      id: "2345ghjjk",
      token: "23jrtiheriufyqwidsf",
      userName: "@wds-ui",
      workspace: "dci",
    };
    let statusOnline = "online";
    let statusOffline = "offline";

    const findUser = participants.find(
      (participant: any) => participant.id === id
    );

    if (!findUser) {
      participants.push({
        id,
        token,
        userName,
        workspace,
        userStatus: statusOnline,
      });
    }
    const private_message: string = `${workspace}-${token}-${id}`;

    // const wsFs = files.map((acc: any, file: any) => {
    //   const filePath = path.resolve(wsDir, file);
    //   const isFile = fs.lstatSync(filePath);

    //   if (isFile.isFile()) {
    //     acc.push({
    //       type: "file",
    //       endPoint: filePath,
    //       name: file,
    //     });
    //   } else {
    //     acc.push({
    //       type: "folder",
    //       endPoint: filePath,
    //       name: file,
    //     });
    //   }

    //   return acc;
    // }, []);

    const wsDir = path.resolve("vscode", "workspace");

    fs.readdir(wsDir, (err, files) => {
      const wsFiles = buildWsFiles(files, wsDir);

      socket.broadcast.emit("member_connect_channel", {
        id,
        token,
        userName,
        workspace,
        userStatus: statusOnline,
        credentials,
      });

      const fPath = path.resolve(
        "public/repositories/64f0f8ad18904bdeb90cc799/64f0f8c058ab9b207099e886/README.md"
      );

      const isExist = fs.existsSync(fPath);

      console.log("isExist ==> ", isExist);

      if (isExist) {
        const readStream = fs.createReadStream(fPath);

        readStream.on("data", (chunk) => {
          const data = chunk.toString();
          const slides = data
            .trim()
            .split("\n\n\n")
            .filter((e: any) => e !== "")
            .reduce(formatStringReducer, "")
            .split(".slide.webdrei.pins.")
            .filter((e: string) => e !== "")
            .map(daltaMap);

          socket.emit(private_message, {
            vscode: wsFiles,
            slides,
            markdown: data,
            slidesState: {},
            handshake: socket.handshake,
            session,
            participants,
          });
        });

        readStream.on("end", () => {
          console.log("file has been read completely");
        });
      }
    });

    socket.on("update-slides-state", (state: any) => {
      socket.broadcast.emit("update-slides-state", state);
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("member_disconnect_channel", {
        id,
        token,
        userName,
        workspace,
        userStatus: statusOffline,
      });
    });
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

export default socketMain;
