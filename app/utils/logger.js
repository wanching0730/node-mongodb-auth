/*
1. Customised logger to categorise logs into 3 types: audit, general and error
2. New log file will be created on everyday with the specific date as file name in /log folder
3. Types:
    Audit: Logs for login, registration and logout
    General: Logs for the actions and audit information
    Error: Logs for all general and customised error messages
*/

const path = require("path");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format
require("winston-daily-rotate-file");

const dailyRotateFileTransport = type => {
    return new transports.DailyRotateFile({
        filename: type === "error" ? `log/%DATE%-error.log` : type === "audit" ? `log/%DATE%-audit.log` : `log/%DATE%-general.log`,
        datePattern: "YYYY-MM-DD"
    })
}

const getFilename = filename => {
    const parts = filename.split(path.sep)
    return path.join(parts[parts.length-2], parts.pop())
}

const logger = type => {
    return new createLogger({
        level: "verbose",
        format: combine(
            timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            printf(options => `${options.timestamp} [${options.level.toUpperCase()}] ${options.label}: ${options.message}`)
),
    transports: [
        new transports.Console({ level: "info" }),
        dailyRotateFileTransport(type)
    ]})
}

module.exports = filename => {
    return {
        error: (msg) => {
            logger("error").error(msg, { label: getFilename(filename) })
        },
        warn: (msg) => {
            logger("general").warn(msg, {label: getFilename(filename) })
        },
        info: (msg) => {
            logger("general").info(msg, { label: getFilename(filename) })
        },
        audit: (msg) => {
            logger("general").info(msg, { label: getFilename(filename) })
            logger("audit").info(msg, { label: getFilename(filename) })
        }
    }
}
