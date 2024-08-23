import { TryCatch } from "../middlewares/error.js";
import { NewBlogPostRequestBody } from "../types/types.js";
import { Request, Response, NextFunction } from 'express';
import ErrorHandler from "../utils/utility-class.js";

import sanitizeHtml from 'sanitize-html';  // To sanitize HTML input
import * as cloudinary from "cloudinary";
import { EventPost, IEventPost } from "../models/events.js";
import { GuidePost } from "../models/guide.js";
export const newGuidePost = TryCatch(
    async (req: Request<{}, {}, NewBlogPostRequestBody>, res: Response, next: NextFunction) => {

        let imagesFromRequest: any[] = [];
        const { title, content, author, images } = req.body;

        // Validate required fields
        if (!title || !content || !author || !author.name || !author.email) {
            return next(new ErrorHandler("Please fill in all required fields", 400));
        }

        // Sanitize HTML content to prevent XSS or malicious scripts
        const sanitizedContent = sanitizeHtml(content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'iframe', 'video']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                '*': ['style', 'class', 'id']  // Allow custom styles if needed
            }
        });

        // Check if the blog title already exists (unique constraint)
        const existingGuidePost = await GuidePost.findOne({ title });
        if (existingGuidePost) {
            return next(new ErrorHandler("A guide post with this title already exists", 400));
        }

        // Check if the author email is unique

        // Create new blog post
        if (typeof req.body.images === "string") {
            imagesFromRequest.push(req.body.images);
        } else {
            imagesFromRequest = req.body.images;
        }

        const imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(imagesFromRequest[i], {
                folder: "guide",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });

            // console.log("imageLinks", imagesLinks)
        }
        const guidePost = await GuidePost.create({
            title,
            content: sanitizedContent,  // Save sanitized content
            author,
            images: imagesLinks,
            // Default is null if not provided
        });

        // Prepare response object
        const responseGuidePost: IEventPost = {
            ...guidePost.toJSON(),
        };

        return res.status(201).json({
            success: true,
            message: `Guide post '${guidePost.title}' created successfully`,
            guidePost: responseGuidePost,
        });
    }
);