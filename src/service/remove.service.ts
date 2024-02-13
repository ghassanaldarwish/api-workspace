import model from "../models";
import jwt from "../lib/jwt";
import fs from "fs";
import redis, { createRedisModel, findRedisModel } from "../lib/redis";
import { rimraf } from "rimraf";

const fsPromises = fs.promises;
export async function removeModel({ name }: { name: string }) {
  const payload = model(name);
  return payload;
}

const deleteFile = async ({ dir, lessonId }: any) => {
  const dir_name = `public/${dir}/${lessonId}`;

  let isFile = fs.existsSync(dir_name);
  if (isFile) {
    await fsPromises.rm(dir_name, { recursive: true });
  }
};

const deletePinFolder = async ({ lessonId }: any) => {
  const pinPath = `pins/${lessonId}`;

  let isFile = fs.existsSync(pinPath);

  console.log("deletePinFolder ==> isFile", isFile);
  console.log("deletePinFolder ==> pinPath", pinPath);

  if (isFile) {
    await rimraf(pinPath);

    console.log("deletePinFolder ==> deleted");
  }
};

/************* DELETE Route (/remove/one)******************/

export async function removeOne({ body, query, cookies, authorization }: any) {
  const { modelsKey } = query;

  console.log("removeOne ==> { body, query, cookies, authorization }", {
    body,
    query,
    cookies,
    authorization,
  });
  const model: any = await removeModel({ name: modelsKey });
  const payload = await model.findByIdAndDelete(query);
  console.log("removeOne ==> payload", payload);
  await deleteFile({ dir: modelsKey, lessonId: payload._id });
  await deletePinFolder({ lessonId: payload._id });

  await redis.del(payload.id);
  await redis.del(payload.code);
  return payload;
}

/************* DELETE Route (/remove/many)******************/

export async function removeMany({
  body,
  query,
  cookies,
  authorization,
}: any) {}
