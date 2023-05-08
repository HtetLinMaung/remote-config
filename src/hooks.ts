import rateLimit from "express-rate-limit";
import { setSocketIONamespace } from "./share";
import { log } from "starless-logger";

export const beforeServerStart = (app: any) => {
  log("Adding rate limit configuration");
  const config = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later.",
  };
  log(config);

  // Configure rate limiting
  const apiLimiter = rateLimit(config);

  // Apply rate limiting to the configuration endpoints
  app.use("/configuration", apiLimiter);
};

export const afterSocketConnected = (io: any, socket: any) => {
  const socketioNamespace = io.of("/socket.io");
  log("socket.io namespace is created");
  setSocketIONamespace(socketioNamespace);
};
