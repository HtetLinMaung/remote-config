import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import { authenticate, getConfig, readConfigFromFile } from "../../../share";

export default brewBlankExpressFunc(async (req, res) => {
  const method = req.method.toLowerCase();
  if (method != "get") {
    return res.sendStatus(404);
  }
  if (!authenticate(req)) {
    throwErrorResponse(403, "Forbidden: Invalid API key.");
  }
  let config = getConfig();
  if (!config) {
    await readConfigFromFile();
    config = getConfig();
  }
  const { key } = req.params;
  if (config.hasOwnProperty(key)) {
    res.json({
      code: 200,
      message: "Success!",
      data: config[key],
    });
  } else {
    throwErrorResponse(404, "Configuration key not found.");
  }
});
