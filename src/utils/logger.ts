import colors, { Color } from "colors";
import moment from "moment";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
type LogMethod = "SUCCESS" | "WARNING" | "INFO" | "ERROR";
type Method = RequestMethod | LogMethod;

const logColors: Record<Method, Color> = {
  GET: colors.green,
  SUCCESS: colors.green,
  POST: colors.yellow,
  WARNING: colors.yellow,
  PUT: colors.blue,
  INFO: colors.blue,
  DELETE: colors.red,
  ERROR: colors.red,
};

const formatTimestamp = (): string => {
  const formattedTime = moment().format("YYYY-MM-DD HH:mm:ss");
  return `[${formattedTime.italic}]`;
};

const getColor = (method: Method): Color => logColors[method];

const formatLogMessage = (method: Method, message: string): string => {
  const color: Color = getColor(method);
  const timestamp = formatTimestamp();
  const coloredLevel = `${method}.${color}`;
  return `${timestamp} ${coloredLevel} :: ${message}`;
};

class Logger {
  logInfo(message: string) {
    console.info(formatLogMessage("INFO", message));
  }

  logError(message: string) {
    console.error(formatLogMessage("ERROR", message));
  }

  logSuccess(message: string) {
    console.log(formatLogMessage("SUCCESS", message));
  }

  logWarning(message: string) {
    console.warn(formatLogMessage("WARNING", message));
  }
}

export { formatTimestamp, getColor };

export default new Logger();
