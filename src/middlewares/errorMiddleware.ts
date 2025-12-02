import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
    statusCode?: number;
}

const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error(err.stack);
    const statusCode = res.statusCode !== 200 ? res.statusCode : (err.statusCode || 500);
    res.status(statusCode).json({
        message: err.message || "Something went wrong!",
    });
};

export default errorHandler;