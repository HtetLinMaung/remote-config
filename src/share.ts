import { Request } from "express";
import fs from "fs/promises";
import path from "path";
import { log } from "starless-logger";

let socketioNamespace: any = null;

export const getSocketIONamespace = () => {
  return socketioNamespace;
};

export const setSocketIONamespace = (namespace: any) => {
  socketioNamespace = namespace;
};

export const CONFIG_FILE_PATH = path.join(__dirname, "config.json");

export interface ConfigData {
  [key: string]: string;
}
// In-memory configuration storage
let config: ConfigData = {};

export const getConfig = () => {
  return config;
};

export const setConfig = (data: ConfigData) => {
  config = data;
};

// Read configuration from the file and store it in memory
export async function readConfigFromFile() {
  try {
    const data = await fs.readFile(CONFIG_FILE_PATH, "utf8");
    setConfig(JSON.parse(data));
  } catch (err) {
    if (err.code === "ENOENT") {
      log("Configuration file not found. Using empty configuration.");
      setConfig({});
    } else {
      log(err, "error");
      throw err;
    }
  }
}
// Add a middleware function to check for the API key in the request header
export function authenticate(req: Request) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return false;
  }
  return true;
}
