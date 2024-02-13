import * as dotenv from "dotenv";
dotenv.config();

const environmentVariables: any = {
  nodeEnv: process.env.NODE_ENV,
  dbUri: process.env.DB_URI,
  dbName: process.env.DB_NAME,
  port: process.env.PORT,
  role: process.env.ROLE,
  origin: process.env.ORIGIN,
  serviceName: process.env.SERVICE_NAME,
  jwtSecret: process.env.JWT_SECRET,
  jwtSecretSocket: process.env.JWT_SECRET_SOCKET,
  mongoAtlasUser: process.env.MONGO_ATLAS_USER,
  mongoAtlasPassword: process.env.MONGO_ATLAS_PASSWORD,
  webdreiDir: process.env.WEBDREI_DIR,
  free: process.env.FREE,
  premium: process.env.PREMIUM,
  gold: process.env.GOLD,
  kafkaBrokerListener: process.env.KAFKA_BROKER_LISTENER,
  redisURL: process.env.REDIS_URL,
  redisExpireTime: process.env.REDIS_EXPIRE_TIME,
  cacheHost: process.env.CACHE_HOST,
  ownerEmail: process.env.OWNER_EMAIL,
  ownerPassword: process.env.OWNER_PASSWORD,
  ownerName: process.env.OWNER_NAME,
};
export default environmentVariables;
