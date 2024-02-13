import { Request, Response } from "express";
import service from "../service";
import jwt from "../lib/jwt";

import { StatusCodes } from "http-status-codes";

import { randomUUID } from "crypto";

/************* DELETE Route (/remove/one)******************/

export async function removeOne(req: any, res: Response) {
  try {
    const payload = await service.remove.removeOne({
      query: req.query,
      cookies: req.cookies,
      body: req.body,
      authorization: { userEmail: req?.userEmail, userId: req?.userId },
    });
    res.status(StatusCodes.CREATED).json(payload);
  } catch (e: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: e.message });
  }
}

/************* DELETE Route (/remove/many)******************/

export async function removeMany(req: any, res: Response) {
  try {
    const payload = await service.remove.removeMany({
      query: req.query,
      cookies: req.cookies,
      body: req.body,
      authorization: { userEmail: req?.userEmail, userId: req?.userId },
    });
    res.status(StatusCodes.CREATED).json(payload);
  } catch (e: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: e.message });
  }
}
/************* Pins Controller ******************/

export async function removeSlide(req: any, res: Response) {
  try {
    const payload = await service.pins.removeSlide({
      query: req.query,
      cookies: req.cookies,
      body: req.body,
      authorization: { userEmail: req?.userEmail, userId: req?.userId },
    });
    res.status(StatusCodes.OK).json(payload);
  } catch (e: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: e.message });
  }
}
