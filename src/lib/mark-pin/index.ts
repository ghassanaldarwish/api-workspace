import slugify from "../slugify";
import fs from "fs";
import path from "path";

import fsPromises from "fs/promises";

export const formatStringReducer = (
  accumulator: any,
  element: any,
  index: number
) => {
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

export const createId = (str: string, index: number) =>
  slugify(str.slice(0, 25)) + "-" + index;

export const createInnerText = (str: string, pattern: string) =>
  str.replace(/\n/g, " ").replace(pattern, "").trim();

export const typesMap = (elStart: string, index: number) => {
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

  const id = createId(elStart, index);

  return { type: "paragraph", text: elStart, id };
};
export const daltaMap = (raw: string, index: number) => {
  const props = typesMap(raw.trim().replace(/\n/g, ""), index);

  // return { note:'', children: [{raw, index, ...props}], title: '', description:'', };
  const block = { raw, index, ...props };

  return block;
};

export function generatePaths(input: any) {
  let currentPath = input.volume;
  let paths = [];

  for (let i = 0; i < input.path.length; i++) {
    currentPath += "/" + input.path[i];
    if (i !== input.path.length - 1) {
      // If it's not the last element, add a trailing slash
      paths.push(currentPath + "/");
    } else {
      paths.push(currentPath);
    }
  }

  return paths;
}

export const writeFile = async ({ data, volume, path }: any) => {
  const isVolume = fs.existsSync(`${volume}/`);

  if (!isVolume) {
    throw new Error("Volume not found");
  }
  const paths = generatePaths({ volume, path });

  paths.forEach((path: any, index) => {
    const isExists = fs.existsSync(path);
    if (!isExists) {
      if (index === paths.length - 1) {
        const slides = data
          .trim()
          .split("\n\n\n")
          .filter((e: any) => e !== "")
          .reduce(formatStringReducer, "")
          .split(".slide.webdrei.pins.")
          .filter((e: string) => e !== "")
          .map(daltaMap);

        const dataJSON = JSON.stringify(slides);
        //const fileJsonPath = path[path.length - 1].split(".")[0] + ".json";
        fsPromises.appendFile(
          path.replace("README.md", "slides.json"),
          dataJSON
        );
        fsPromises.appendFile(path, data);
      } else {
        fs.mkdirSync(path);
      }
    }
  });
};

export const updateFile = async ({ data, volume, path }: any) => {
  console.log("data, volume, path", data, volume, path);

  const isVolume = fs.existsSync(`${volume}/`);

  if (!isVolume) {
    throw new Error("Volume not found");
  }
  const paths = generatePaths({ volume, path });
  paths.forEach((path: any, index) => {
    const isExists = fs.existsSync(path);
    if (!isExists) {
      if (index === paths.length - 1) {
        fsPromises.appendFile(path, data);
      } else {
        fs.mkdirSync(path);
      }
    }
  });
};

export const readFile = async ({ volume, path }: any) => {
  const isVolume = fs.existsSync(`${volume}/`);

  if (!isVolume) {
    throw new Error("Volume not found");
  }
  const paths = generatePaths({ volume, path });

  const fileMarkdownPath = paths[paths.length - 1];
  //const fileJsonPath = paths[paths.length - 1];

  const readStream = fs.createReadStream(fileMarkdownPath);

  return new Promise((resolve, reject) => {
    paths.forEach((path: any, index) => {
      const isExists = fs.existsSync(path);
      if (!isExists) {
        if (index === paths.length - 1) {
          fsPromises.appendFile(path, " ");
        } else {
          fs.mkdirSync(path);
        }
      }
    });

    readStream.on("data", (chunk) => {
      const data = chunk.toString();
      const slides = JSON.parse(data);
      console.log("chunk", slides);
      resolve(slides);
    });

    readStream.on("end", () => {
      console.log("end");
    });
    readStream.on("error", (err) => {
      console.log("error", err);
      reject(err);
    });
  });
};
