import { NextFunction, Request, Response } from "express";

import { ControllerType } from "../types/types.js";
import { error } from "console";
import ErrorHandler from "../utils/utility-class.js";

export const errorMiddleWare = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction

) => {

    console.log("error", err)
    err.message ||= "Internal Server Error";
    err.statusCode ||= 500
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    if (err.code === 11000) {
        const message = `${Object.keys(err.keyValue)} already taken`;
        err = new ErrorHandler(message, 400);
    }
    // Wrong JWT error
    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, Try again `;
        err = new ErrorHandler(message, 400);
    }

    // JWT EXPIRE error
    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired, Try again `;
        err = new ErrorHandler(message, 400);
    }
    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    })

}

export const TryCatch =
    (func: ControllerType) =>
        (req: Request, res: Response, next: NextFunction) => {
            return Promise.resolve(func(req, res, next)).catch(next);
        };