import mongoose from 'mongoose'

import validator from 'validator'
import bcrypt from 'bcryptjs';

import jwt from "jsonwebtoken"
export interface IUser extends Document {
    name: string,
    _id?: string,
    email: string,
    password: string
    role: "admin" | "user" | "broker" | "owner" | "builder" | "superadmin",
    createdAt: Date,
    updatedAt: Date,
    resetPasswordToken: string,
    resetPasswordExpire: Date;
    comparePassword(password: string): Promise<boolean>;
    getJWTToken: () => string;
}
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
    },
    email: {
        type: String,
        unique: [true, "Email already Exists"],
        required: [true, "Please enter email"],
        validate: validator.default.isEmail

    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false, // Exclude by default
    },


    role: {
        type: String,
        enum: ["admin", "user", "broker", "owner", "builder", "superadmin"]
    }, createdAt: {
        type: Date,
        default: Date.now,
    },


}, {
    timestamps: true,
})
schema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    } catch (err: any) {
        return next(err);
    }
});

schema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};


schema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET || "default_secret", {
        expiresIn: process.env.JWT_EXPIRE || "1h"  // Set an appropriate expiration time
    });
}


export const User = mongoose.model<IUser>("User", schema)