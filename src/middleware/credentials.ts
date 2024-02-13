import jwt from "../lib/jwt";
import Auth from "../models/auth";
import User from "../models/user";

async function credentials(req: any, res: any, next: any) {
  const credentials = req.headers.authorization || req.headers.Authorization;
  console.log("credentials cookies => ", req.cookies);
  console.log("credentials  => ", credentials);

  next();
}

export default credentials;
