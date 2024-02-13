import { Request, Response } from "express";
import service from "../service";
import { StatusCodes } from "http-status-codes";

/************* GET Route (/find/one)******************/

export async function findOne(req: any, res: Response) {
  try {
    const payload = await service.find.findOne({
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

// users
export async function findOneUser(req: any, res: Response) {
  try {
    const payload = await service.find.findOneUser({
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

/************* GET Route (/find/many)******************/

export async function findMany(req: any, res: Response) {
  try {
    const payload = await service.find.findMany({
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

/************* Login ******************/
export async function login(req: Request, res: Response) {
  console.log("login controller", req.body);
  try {
    const payload: any = await service.find.login(req);
    res.status(StatusCodes.OK).json(payload);
  } catch (e: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: e.message });
  }
}

export async function clientLogin(req: Request, res: Response) {
  console.log("login controller", req.body);
  try {
    const payload: any = await service.find.clientLogin(req);
    res.status(StatusCodes.OK).json(payload);
  } catch (e: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: e.message });
  }
}

/************* Join ******************/
export async function join(req: Request, res: Response) {
  console.log("join controller", req.body);
  try {
    const payload: any = await service.find.join(req);

    res.status(StatusCodes.OK).json(payload);
  } catch (e: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: e.message });
  }
}

/************* Pins Controller ******************/

export async function findPins(req: any, res: Response) {
  try {
    const payload = await service.pins.findMany({
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
export async function findPin(req: any, res: Response) {
  try {
    const payload = await service.pins.findOne({
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
