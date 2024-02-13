import rateLimit from "express-rate-limit";
import logger from "./logger";
import environment from "../lib/environment";

const limiter = rateLimit({
  windowMs: 60 * 1000 * 60, // 1 hour
  max: environment.nodeEnv === "development" ? 1000000 : 5, // Limit each IP to 5 login requests per `window` per minute
  message: {
    message:
      "Too many login attempts from this IP, please try again after a 60 minutes",
  },
  handler: (req: any, res: any, next: any, options: any) => {
    logger.logEvents(
      `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default limiter;
