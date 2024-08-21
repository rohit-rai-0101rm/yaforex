import { TryCatch } from "../middlewares/error.js";
import { NewBlogPostRequestBody } from "../types/types.js";
import { Request, Response, NextFunction } from 'express';
import ErrorHandler from "../utils/utility-class.js";
import { BlogPost, IBlogPost } from "../models/blogs.js";
import sanitizeHtml from 'sanitize-html';  // To sanitize HTML input
export const newBlogPost = TryCatch(
    async (req: Request<{}, {}, NewBlogPostRequestBody>, res: Response, next: NextFunction) => {
        const { title, content, author, publishedAt } = req.body;

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
        const existingAuthor = await BlogPost.findOne({ 'author.email': author.email });
        if (existingAuthor) {
            return next(new ErrorHandler("An author with this email already exists", 400));
        }

        // Create new blog post
        const blogPost = await BlogPost.create({
            title,
            content: sanitizedContent,  // Save sanitized content
            author,
            publishedAt: publishedAt || null  // Default is null if not provided
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