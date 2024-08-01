import { NextFunction, Response } from "express";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from "../types/types.js";
// Middleware to make sure only admin is allowed
export const authorizeRoles = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "You are not allowed to perform this action" });
        }
        next();
    };
};

export const isAuthenticated = TryCatch(async (req, res, next) => {
    let token = req.headers.token;
    console.log("tokenmiddleware", token)
    if (!token) return next(new ErrorHandler("Please log in", 401));

    // Ensure token is a string
    if (Array.isArray(token)) {
        token = token[0];
    }

    try {
        const decoded = jwt.verify(token, "sifnsdjkfnsdkjfnsdkjfsdkjfbsdkjfbdskjfbsdkjfbsdkjfbnskdjnbfksdjbfskdjbfskwdjbfskdzbfksdjbf");

        if (typeof decoded === "string" || !decoded.id) {
            return next(new ErrorHandler("Invalid token, please log in again", 401));
        }

        const user = await User.findById((decoded as JwtPayload).id);
        if (!user) return next(new ErrorHandler("User not found", 404));

        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid token, please log in again", 401));
    }
});