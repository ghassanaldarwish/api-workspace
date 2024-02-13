import model from "../models";
import redis, { createRedisModel, findRedisModel } from "../lib/redis";

import { Request } from "express";
import environment from "../lib/environment";
export async function updateModel({ name }: { name: string }) {
  const payload = model(name);
  return payload;
}

/************* PUT Route (/update/one)******************/

export async function updateOne({ body, query, cookies, authorization }: any) {
  const { modelsKey } = query;
  const model: any = await updateModel({ name: modelsKey });
  await model.updateOne(query, body);
  const payload = await model.findOne(query);
  await createRedisModel(payload.id, payload);
  return payload;
}

/************* PUT Route (/update/many)******************/

export async function updateMany({
  body,
  query,
  cookies,
  authorization,
}: any) {}
