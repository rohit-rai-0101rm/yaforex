import mongoose, { Schema, Document, model } from 'mongoose';

export interface IAuthor extends Document {
    name: string;
    email: string;
}

export interface IBlogPost extends Document {
    title: string;

    content: string;

    author: {
        name: string;
        email: string;
    };

    publishedAt?: Date;
}

const blogPostSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please enter the blog post title"],
            unique: true,
            maxLength: [100, "Title cannot exceed 100 characters"]
        },

        content: {
            type: String,
            required: [true, "Please enter the blog post content"]
        },

        author: {
            type: {
                name: { type: String, required: true },
                email: { type: String, required: true, unique: true }
            },
            required: [true, "Please specify the author"]
        },

        publishedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export const BlogPost = model<IBlogPost>("BlogPost", blogPostSchema);
