import mongoose, { Document } from 'mongoose';
import validator from 'validator';

export interface IUser extends Document {
    mobileNumber: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: [true, "Please enter your mobile number"],
        validate: {
            validator: (value: string) => validator.isMobilePhone(value, 'any', { strictMode: false }),
            message: "Please enter a valid mobile number"
        },
        unique: true,
    },
    balance: {
        type: Number,
        default: 10000,
    },
}, {
    timestamps: true,
});

export const User = mongoose.model<IUser>("User", schema);
