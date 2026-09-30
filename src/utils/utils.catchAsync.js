// CREATING A GLOBAL SYSTEM TO CATCH THE ASYNC ERRORS 
// THIS WILL HELP TO AVOID WRITING TRY CATCH EVERYWHERE TO MAKE THE CODE CLEAN

export const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}



