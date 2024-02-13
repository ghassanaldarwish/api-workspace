import jwt from "../lib/jwt";
import Auth from "../models/auth";
import User from "../models/user";

async function authenticate(req: any, res: any, next: any) {
  const authorization = req.headers.authorization || req.headers.Authorization;
  console.log("authenticate  => ", authorization);

  if (!authorization) return res.status(403).json({ message: "Forbidden" });

  let accessToken = authorization;
  if (authorization.startsWith("Bearer")) {
    accessToken = authorization?.split(" ")[1];
  }

  console.log("authenticate accessToken => ", accessToken);

  try {
    const token: any = jwt.tokenVerify(accessToken);
    const user = await User.findOne({ email: token.email });
    const auth: any = await Auth.findOne({ refreshToken: accessToken });

    if (!user || !auth) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.userEmail = auth.email;
    req.userId = auth.userId;

    console.log("authenticate accessToken auth=> ", auth);
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
    // throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
}

export default authenticate;
/*import CustomError from "../errors";
import utils from "../utils";
//import Token from "../models/token.model";

import environment from "../lib/environment";

const authenticate = async (req: any, res: any, next: any) => {
  const { refreshToken } = req.cookies;
  console.log("authenticate req.cookies => ", req.cookies);
  try {
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

// const authorizePermissions = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       throw new CustomError.UnauthorizedError(
//         "Unauthorized to access this route"
//       );
//     }
//     next();
//   };
// };

export default {
  authenticate,
};

/**
   if (accessToken) {
       const payload = utils.isTokenValid(accessToken);
       req.user = payload.user;
       return next();
     }
     const payload = utils.isTokenValid(refreshToken);

     const existingToken = await Token.findOne({
       user: payload.user.userId,
       refreshToken: payload.refreshToken,
     });

     if (!existingToken || !existingToken?.isValid) {
       throw new CustomError.UnauthenticatedError("Authentication Invalid");
     }

     if (environment.role !== payload.user.role) {
       res.cookie("accessToken", "", {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         signed: true,
         expires: new Date(Date.now()),
       });

       res.cookie("refreshToken", "", {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         signed: true,
         expires: new Date(Date.now()),
       });
       throw new CustomError.UnauthenticatedError("Not Allowed");
     }

     utils.attachCookiesToResponse({
       res,
       user: payload.user,
       refreshToken: existingToken.refreshToken,
     });

     req.user = payload.user;
  */
