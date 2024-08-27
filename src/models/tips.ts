import mongoose, { Schema, Document, model } from 'mongoose';

// Enum for Tip Types
export enum TipType {
    BUYING = 'buying',
    SELLING = 'selling',
    INVESTMENT = 'investment',
    LEGAL = 'legal',
    MARKET_TRENDS = 'market-trends'
}

// Author Interface
export interface IAuthor extends Document {
    name: string;
    email: string;
}

const AuthorSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }
});

// Tips Interface
export interface ITip extends Document {
    title: string;
    content: string;
    type: TipType;
    author: IAuthor;
}

// Tips Schema
const TipSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please enter the tip title"],
            maxLength: [100, "Title cannot exceed 100 characters"]
        },
        content: {
            type: String,
            required: [true, "Please enter the tip content"]
        },
        type: {
            type: String,
            enum: Object.values(TipType), // Restrict type to the enum values
            required: [true, "Please specify the tip type"]
        },
        author: {
            type: AuthorSchema,
            required: [true, "Please specify the author"]
        }
    },
    {
        timestamps: true
    }
);

export const Tip = model<ITip>("Tip", TipSchema);
