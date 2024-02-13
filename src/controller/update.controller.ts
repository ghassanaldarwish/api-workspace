import { Request, Response } from "express";
import service from "../service";
import { StatusCodes } from "http-status-codes";

/************* PUT Route (/update/one)******************/

export async function updateOne(req: any, res: Response) {
  try {
    const payload = await service.update.updateOne({
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

/************* PUT Route (/update/many)******************/

export async function updateMany(req: any, res: Response) {
  try {
    const payload = await service.update.updateMany({
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

export async function updatePin(req: any, res: Response) {
  try {
    const payload = await service.pins.updateOne({
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
