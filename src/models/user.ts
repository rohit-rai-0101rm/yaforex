import mongoose, { Document } from 'mongoose';
import validator from 'validator';

export interface IUser extends Document {
    mobileNumber: string;
    balance: number;
    isVerified: boolean; // Verification status
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
        default: 1000, // Default balance for new users
    },
    isVerified: {
        type: Boolean,
        default: false, // Default to false until verified
    },
}, {
    timestamps: true,
});

export const User = mongoose.model<IUser>("User", schema);
