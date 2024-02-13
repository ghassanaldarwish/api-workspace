import redis, { createRedisModel, findRedisModel } from "../lib/redis";
import slugify from "../lib/slugify";
import { writeFile, readFile, generatePaths } from "../lib/mark-pin";

import Pin from "../models/pin";
import fs from "fs";
import path from "path";

import fsPromises from "fs/promises";

export async function createOne({ body, query, cookies, authorization }: any) {
  console.log("createOne pins", body);
  const payload = new Pin({});

  await payload.save();
  console.log("payload ==> ", payload);
  await writeFile({
    data: "# " + payload.title + "\n",
    volume: "files",
    path: ["repositories", payload.id, "README.md"],
  });
  return payload;
}

export async function findMany({ body, query, cookies, authorization }: any) {
  console.log("createOne pins", body);
  const payload = await Pin.find({});

  return payload;
}

export async function findOne({ body, query, cookies, authorization }: any) {
  console.log("createOne pins", body);
  console.log("query findOne pins", query);

  const payload: any = await Pin.findOne(query);
  const slides = await readFile({
    volume: "files",
    path: ["repositories", payload.id, "slides.json"],
  });

  const isVscode = payload.vscode.startsWith("/config/workspace");

  if (isVscode) {
    const vscodePath = payload.vscode
      .split("/")
      .filter((folder: string) => !!folder && folder !== "config")
      .join("/");

    const files = await fsPromises.readdir("files/vscode/" + vscodePath);
    files.forEach((file) => {
      console.log(file);
    });
    return { payload, slides, files };
  }

  return { payload, slides };
}

export async function updateOne({ body, query, cookies, authorization }: any) {
  console.log("updateOne pins", body);
  console.log("query updateOne pins", query);
  const { action } = query;

  if (action === "create-slide") {
    const payload: any = await Pin.findOne({ _id: query._id });
    const slides: any = await readFile({
      volume: "files",
      path: ["repositories", payload.id, "slides.json"],
    });

    if (slides) {
      slides.push({});
      console.log("slides", slides);
      updateFile({
        data: slides,
        volume: "files",
        path: ["repositories", payload.id, "slides.json"],
      });
      updateFile({
        data: slides,
        volume: "files",
        path: ["repositories", payload.id, "README.md"],
      });
      const isVscode = payload.vscode.startsWith("/config/workspace");
      if (isVscode) {
        const vscodePath = payload.vscode
          .split("/")
          .filter((folder: string) => !!folder && folder !== "config")
          .join("/");

        const files = await fsPromises.writeFile(
          "files/vscode/" + vscodePath + "/README.md",
          JSON.stringify(slides)
        );
      }
      return { slides };
    }
  } else if (action === "update-title") {
    const payload: any = await Pin.findOne({ _id: query._id });
    payload.title = body.title;
    payload.save();
    return payload;
  } else if (action === "update-vscode") {
    const payload: any = await Pin.findOne({ _id: query._id });
    payload.vscode = body.vscode;
    payload.save();
    return payload;
  }

  return true;
}

export async function removeSlide({
  body,
  query,
  cookies,
  authorization,
}: any) {
  console.log("removeSlide slide", body);
  console.log("query removeSlide pins", query);
  const { pinId, pageIndex, _id } = query;

  const payload: any = await Pin.findOne({ _id: pinId });
  const slides: any = await readFile({
    volume: "files",
    path: ["repositories", payload.id, "slides.json"],
  });

  const newSlides = slides.filter((slide: any, index: any) => {
    if (index !== Number(pageIndex)) {
      return slide;
    }
  });

  console.log("newSlides", newSlides);

  updateFile({
    data: newSlides,
    volume: "files",
    path: ["repositories", payload.id, "slides.json"],
  });
  updateFile({
    data: newSlides,
    volume: "files",
    path: ["repositories", payload.id, "README.md"],
  });
  const isVscode = payload.vscode.startsWith("/config/workspace");
  if (isVscode) {
    const vscodePath = payload.vscode
      .split("/")
      .filter((folder: string) => !!folder && folder !== "config")
      .join("/");

    const files = await fsPromises.writeFile(
      "files/vscode/" + vscodePath + "/README.md",
      JSON.stringify(newSlides)
    );
  }
  return newSlides;
}

async function updateFile({ data, volume, path }: any) {
  const isVolume = fs.existsSync(`${volume}/`);

  if (!isVolume) {
    throw new Error("Volume not found");
  }
  const paths = generatePaths({ volume, path });

  console.log("data, volume, path ,paths", data, volume, path, paths);

  paths.forEach((path: any, index) => {
    const isExists = fs.existsSync(path);

    if (!isExists) throw new Error("Path not found");
    if (index === paths.length - 1) {
      fsPromises.writeFile(path, JSON.stringify(data));
    }
  });
}
