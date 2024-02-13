import logger from "./logger";
import limiter from "./limiter";
import notFound from "./notFound";
import errorHandler from "./errorHandler";
import authentication from "./authentication";
import credentials from "./credentials";

export default {
  logger: logger.logger,
  logEvents: logger.logEvents,
  limiter,
  notFound,
  errorHandler,
  authentication,
  credentials,
};
