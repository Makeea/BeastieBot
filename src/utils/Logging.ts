import { createLogger, format, transports } from "winston";
import config from "../config";

switch (config.LOG_LEVEL) {
  case "info":
  case "debug":
  case "warn":
  case "error":
    break;
  default:
    throw `Invalid log type ${config.LOG_LEVEL}! - See Logging.ts`;
}

const opts = {
  level: config.LOG_LEVEL,
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "BeastieBot" },
  transports: [
    new transports.File({ filename: "BeastieError.log", level: "error" }),
    new transports.File({ filename: "BeastLogs.log" })
  ]
};

console.log(`Log level: ${opts.level}`);

const beastieLogger = createLogger(opts);

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== "production") {
  beastieLogger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  );
}

export function swallowRejection(
  errorMessage: string,
  errorLog: (message: string) => void = beastieLogger.error
): (rejection: any) => Promise<null> {
  return async (error: any) => {
    await errorLog(`${errorMessage}: ${JSON.stringify(error)}`);
    return null;
  };
}
export { beastieLogger as BeastieLogger };
