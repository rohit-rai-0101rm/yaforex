import { NextFunction, Request, Response } from "express";
import { LoginUserRequestBody, NewUserRequestBody, updateUserRoleRequestBody } from "../types/types.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";
import { sendToken } from "../utils/sendToken.js";

export const newUser = TryCatch(
    async (
        req: Request<{}, {}, NewUserRequestBody>,
        res: Response,
        next: NextFunction
    ) => {
        const { name, email, password } = req.body;




        if (!name || !email || !password)
            return next(new ErrorHandler("Please add all fields", 400));

        let user = await User.create({
            name,
            email,
            password,
            role: "user"
        });

        return res.status(201).json({
            success: true,
            message: `Welcome, ${user.name}`,
        });
    }
);

export const loginUser = TryCatch(
    async (
        req: Request<{}, {}, { email: string; password: string }>,
        res: Response,
        next: NextFunction
    ) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Please Enter Email & Password", 400));
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 401));
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid email or password", 401));
        }

        sendToken(user, 200, res);
    }
);


export const getAllUsers = TryCatch(async (req, res, next) => {


    const users = await User.find({});

    return res.status(200).json({
        success: true,
        users,
    });
});

export const deleteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) return next(new ErrorHandler("Invalid Id", 400));

    await user.deleteOne();

    return res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});

export const getUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) return next(new ErrorHandler("Invalid Id", 400));

    return res.status(200).json({
        success: true,
        user,
    });
});


export const updateUserRole = TryCatch(
    async (
        req: Request<{}, {}, updateUserRoleRequestBody>,
        res: Response,
        next: NextFunction
    ) => {
        const { name, email, role } = req.body;
        console.log("updateUserRole", email)
        // Validate the input
        if (!email || !name || !role) {
            return next(new ErrorHandler("Please provide email, name, and role", 400));
        }

        // Find the user by email and name
        const user = await User.findOne({ email, name });

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Update the user role
        user.role = role;
        await user.save();

        return res.status(200).json({
            success: true,
            message: `User role updated to ${role}`,
            user,
        });
    }
);