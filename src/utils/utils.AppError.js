
// A GLOBAL ERROR CONTROLLER FOR THE PROJECT TO HANDLE EXTENDS THE ERROR CLASS AND ALSO PROVIDES SOME CONTEXT TO THE APP ERROR HANDLER

export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? "Fail": 'Error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor)
    }
}


