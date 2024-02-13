import cors from "cors";
import express, { Express, Request, Response } from "express";
import http from "http";
import connectDB from "./lib/mongoDB";
import seed from "./lib/seed";

import proxy from "express-http-proxy";
import environment from "./lib/environment";
import middleware from "./middleware";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import url from "url";
import routes from "./routes";
import namespaces from "./namespaces";

const app: Express = express();

const port = environment.port || 4444;
const origin = environment.origin;
const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  path: "/socket.io",
  cors: {
    origin: environment.origin,
    credentials: true,
  },
});
app.set("socket.io", io);

app.use(cors({ origin, credentials: true }));
app.use(cookieParser(environment.jwtSecret));
app.use(express.urlencoded({ extended: true }));

app.use("/cdn", express.static("./public"));
app.use(express.json());
console.log("environment.origin ==> ", environment.origin);

routes(app);
app.use(middleware.notFound);
app.use(middleware.errorHandler);
server.listen(port, () => {
  connectDB();

  namespaces(io);
  seed();
  console.log(`⚡️[server]: Port: ${port}`);
});
