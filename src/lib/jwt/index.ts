import jwt from "jsonwebtoken";
import environment from "../environment";

export const createJWT = (user: any, secret: string, expiresIn: number) => {
  const token = jwt.sign(user, secret, { expiresIn });
  return token;
};

export const tokenVerify = (token: any) =>
  jwt.verify(token, environment.jwtSecret);

export const createToken = (payload: any) => {
  const oneH = 1000 * 60 * 60;
  //const oneH = 1000 * 60 * 60 * 24;
  const oneYear = 1000 * 60 * 60 * 24 * 30 * 12;
  const accessTokenJWT = createJWT(payload, environment.jwtSecret, oneH);
  const refreshTokenJWT = createJWT(payload, environment.jwtSecret, oneYear);

  return {
    accessToken: {
      name: "droplet_access_token",
      value: accessTokenJWT,
    },
    refreshToken: {
      name: "droplet_refresh_token",
      value: refreshTokenJWT,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        maxAge: oneYear,
      },
    },
  };
};

export default { createToken, tokenVerify };
