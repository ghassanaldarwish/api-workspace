import environment from "../environment";
import { Redis } from "ioredis";

const redis = new Redis(environment.cacheHost);

console.log(environment.cacheHost, "Redis connected.... 🚀🚀🚀🚀🚀🚀🚀🚀");

export default redis;

export const createRedisModel = async (model: string, data: any) => {
  await redis.set(model, JSON.stringify(data), "EX", 86400 * 7);
};
export const findRedisModel = async (model: string) => {
  const payload: any = await redis.get(model);
  return JSON.parse(payload);
};
