// GLOBAL ERROR HANDLER IS USED TO HANDLE ERRORS GLOBALLY AT A CENTRAL POINT

export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "";

    // IF THE DEVELOPMENT PROCESS WE CAN SEND TRACE THE STACK IN CONSOLE
    if(process.env.NODE_DEV == "development") {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // IF WE HAVE LOCALE ERROR OF OUR OWN APP
        if(err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        } else {
            // APP ERRORS LIKE DB CRASH, APP ERRORS AND SYNTAX ERRORS ETC
            console.log("💥Error Occured in Global: ", err);
            res.status(500).json({
                status: 'error',
                message: err.message || "Something went wrong"
            })
        }
    }
}