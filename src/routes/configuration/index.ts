import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import fs from "fs/promises";
import {
  CONFIG_FILE_PATH,
  authenticate,
  getConfig,
  getSocketIONamespace,
  readConfigFromFile,
  setConfig,
} from "../../share";

export default brewBlankExpressFunc(async (req, res) => {
  const method = req.method.toLowerCase();

  if (method == "get" || method == "post") {
    if (!authenticate(req)) {
      throwErrorResponse(403, "Forbidden: Invalid API key.");
    }
    let config = getConfig();
    if (!config) {
      await readConfigFromFile();
      config = getConfig();
    }
    if (method == "get") {
      // Get all configuration API endpoint
      res.json({
        code: 200,
        message: "Success!",
        data: config,
      });
    } else if (method == "post") {
      const { key, value } = req.body;

      if (!key || !value) {
        throwErrorResponse(
          400,
          'Invalid request. Both "key" and "value" must be provided.'
        );
      }

      config[key] = value;
      await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(config), "utf8");

      const io = getSocketIONamespace();
      if (io) {
        // Emit the 'configChanged' event to all connected clients in the "socket.io" namespace
        io.emit("configChanged", { key, value });
      }
      res.json({
        code: 200,
        message: "Configuration updated.",
      });
    }
  } else {
    res.sendStatus(404);
  }
});
