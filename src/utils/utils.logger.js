import winston from "winston";
import env from "../config/env.config.js";


const logFormat = winston.format.printf(({level, stack, timestamp, message}) => {
    return `[${timestamp}] [${level.toUpperCase()}]: ${stack || message}`
});


export const logger = winston.createLogger({
    level: env.NODE_ENV === 'development' ? 'debug': 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        logFormat
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), logFormat)
        }),
        new winston.transports.File({filename: "logs/error.log", level: 'error'}),
        new winston.transports.File({filename: "logs/combined.log"}),
    ],
});


// WINSTONG - MORGAN LOGS FOR SERVER
// level -> format -> transports
// which mode -> how to logs -> where to save
