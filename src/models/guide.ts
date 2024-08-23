import mongoose, { Schema, Document, model } from 'mongoose';

export interface IAuthor extends Document {
    name: string;
    email: string;
}
interface IImage extends Document {
    public_id: string;
    url: string;
}


export interface IGuidePost extends Document {
    title: string;

    content: string;

    author: {
        name: string;
        email: string;
    };
    images: IImage[];


}

const GuidePostSchema: Schema = new Schema(
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
        images: {
            type: [{
                public_id: { type: String, required: true },
                url: { type: String, required: true }
            }],
            required: [true, "Please upload images of the blog"],
        },
        author: {
            type: {
                name: { type: String, required: true },
                email: { type: String, required: true, }
            },
            required: [true, "Please specify the author"]
        },


    },
    {
        timestamps: true
    }
);

export const GuidePost = model<IGuidePost>("GuidePost", GuidePostSchema);
