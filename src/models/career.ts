import mongoose, { Schema, Document, model } from 'mongoose';

// Interface for the Career Document
export interface ICareerPost extends Document {
    jobTitle: string;
    location: string;
    experience: string;
    content: string;  // Updated from description to content
}

// Define the Career Schema
const CareerSchema: Schema = new Schema(
    {
        jobTitle: {
            type: String,
            required: [true, "Please enter the job title"],
            unique: true,
            maxLength: [100, "Job title cannot exceed 100 characters"]
        },
        location: {
            type: String,
            required: [true, "Please specify the job location"]
        },
        experience: {
            type: String,
            required: [true, "Please enter the required experience"],
        },
        content: {
            type: String,
            required: [true, "Please provide the job content"]
        }
    },
    {
        timestamps: true
    }
);

// Export the Career model
export const CareerPost = model<ICareerPost>("Career", CareerSchema);
