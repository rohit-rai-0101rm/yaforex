import { Response } from "express";
import { IUser } from "../models/user.js";
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const token = user.getJWTToken(); // Ensure this returns a valid token


    const cookieExpire = Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000;
    const expirationDate = new Date(Date.now() + cookieExpire);



    const options = {
        expires: expirationDate,
        httpOnly: true,
    };
    const sanitizedUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role,
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            user: sanitizedUser,
            token, // Ensure token is populated correctly here
        });
};
