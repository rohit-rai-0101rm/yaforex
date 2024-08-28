import { TryCatch } from "../middlewares/error.js";
import { NewBlogPostRequestBody } from "../types/types.js";
import { Request, Response, NextFunction } from 'express';
import ErrorHandler from "../utils/utility-class.js";
import { BlogPost, IBlogPost } from "../models/blogs.js";
import sanitizeHtml from 'sanitize-html';  // To sanitize HTML input
import * as cloudinary from "cloudinary";
export const newBlogPost = TryCatch(
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
        const existingBlogPost = await BlogPost.findOne({ title });
        if (existingBlogPost) {
            return next(new ErrorHandler("A blog post with this title already exists", 400));
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
                folder: "blogs",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });

            console.log("imageLinks", imagesLinks)
        }
        const blogPost = await BlogPost.create({
            title,
            content: sanitizedContent,  // Save sanitized content
            author,
            images: imagesLinks,
            publishedAt: new Date()   // Default is null if not provided
        });

        // Prepare response object
        const responseBlogPost: IBlogPost = {
            ...blogPost.toJSON(),
        };

        return res.status(201).json({
            success: true,
            message: `Blog post '${blogPost.title}' created successfully`,
            blogPost: responseBlogPost,
        });
    }
);



export const getAllBlogs = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    // Fetch all tips from the database
    const blogPosts = await BlogPost.find();

    if (!blogPosts || blogPosts.length === 0) {
        return next(new ErrorHandler('No Blogs posts found', 404));
    }

    // Send the list of tips to the client
    return res.status(200).json({
        success: true,
        blogPosts,
    });
});