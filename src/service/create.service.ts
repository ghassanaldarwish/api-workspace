import redis, { createRedisModel, findRedisModel } from "../lib/redis";
import slugify from "../lib/slugify";
import model, { Role } from "../models";
import fs from "fs";

/************* POST Route (/create/one)******************/

export async function createOne({ body, query, cookies, authorization }: any) {
  return true;
}

/************* POST Route (/create/many)******************/

export async function createMany({
  body,
  query,
  cookies,
  authorization,
}: any) {}
