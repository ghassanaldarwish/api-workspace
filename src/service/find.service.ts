import environment from "../lib/environment";
import jwt from "../lib/jwt";

import redis, { createRedisModel, findRedisModel } from "../lib/redis";
//import utils from "../utils";
import User from "../models/user";
import Auth from "../models/auth";

import { randomUUID } from "crypto";
import { Request } from "express";
import bcrypt from "bcryptjs";

/************* GET Route (/find/one)******************/

export async function findOne({ body, query, cookies, authorization }: any) {
  const { modelsKey, _id } = query;
  console.log("findOne { body, query, cookies, authorization }", {
    body,
    query,
    cookies,
    authorization,
  });

  const getPin = await findRedisModel(_id);
  console.log("getPin", getPin);
  if (getPin) {
    return getPin;
  } else {
    // const model: any = await findModel({ name: modelsKey });
    // const payload = await model.findOne(query);
    // await createRedisModel(payload.id, payload);
    // console.log("findOne payload", payload);
    // return payload;
  }
}
export async function findOneUser({
  body,
  query,
  cookies,
  authorization,
}: any) {
  const { userEmail, userId } = authorization;
  const user = await User.findOne({ email: userEmail });

  if (!user) throw new Error("User not found");

  return user;
}

/************* GET Route (/find/many)******************/

export async function findMany({ body, query, cookies, authorization }: any) {
  console.log("findMany { body, query, cookies, authorization }", {
    body,
    query,
    cookies,
    authorization,
  });
}

export async function login(req: any) {
  const input = req?.body || req;
  const { email, password } = input;

  if (!email || !password) {
    throw new Error("Please provide email and password");
  }
  const user: any = await User.findOne({ email }).select("+password");

  const isPasswordCorrect = await bcrypt.compare(password, user.password || "");

  const token = jwt.createToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  const auth = new Auth({
    refreshToken: token.refreshToken.value,
    userId: user.id,
    email: user.email,
  });
  await auth.save();
  console.log("loginJwt user pass => ", user.password);
  console.log("loginJwt isPasswordCorrect => ", isPasswordCorrect);
  console.log("loginJwt token => ", token);
  return { token, user };
}

export async function clientLogin(req: any) {
  console.log("clientLogin req", req.body);

  return true;
}

export async function join(req: any) {
  const { refreshToken } = req?.body;
  if (!refreshToken) throw new Error("Please provide refreshToken");
  const token: any = jwt.tokenVerify(refreshToken);
  const auth: any = await Auth.findOne({ refreshToken });
  if (!auth) throw new Error("Not auth found");

  return req?.body;
}
