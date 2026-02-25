export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Error";

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack
        })
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })

}