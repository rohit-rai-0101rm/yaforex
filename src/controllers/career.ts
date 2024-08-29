import { TryCatch } from "../middlewares/error.js";

import { Request, Response, NextFunction } from 'express';
import ErrorHandler from "../utils/utility-class.js";
import { CareerPost, ICareerPost } from "../models/career.js";
import sanitizeHtml from 'sanitize-html';  // To sanitize HTML input
import * as cloudinary from "cloudinary";
import { NewCareerPostRequestBody } from "../types/types.js";
import { CareerApiFeatures } from "../utils/features.js";

export const newCareerPost = TryCatch(
    async (req: Request<{}, {}, NewCareerPostRequestBody>, res: Response, next: NextFunction) => {


        const { jobTitle, location, experience, content } = req.body;

        // Validate required fields
        if (!jobTitle || !location || !experience || !content) {
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

        // Check if the career post with the same title already exists
        const existingCareerPost = await CareerPost.findOne({ jobTitle });
        if (existingCareerPost) {
            return next(new ErrorHandler("A career post with this job title already exists", 400));
        }

        // Handle images



        // Create new career post
        const careerPost = await CareerPost.create({
            jobTitle,
            location,
            experience,
            content: sanitizedContent,  // Save sanitized content

        });

        // Prepare response object
        const responseCareerPost: ICareerPost = {
            ...careerPost.toJSON(),
        };

        return res.status(201).json({
            success: true,
            message: `Career post '${careerPost.jobTitle}' created successfully`,
            careerPost: responseCareerPost,
        });
    }
);




export const getAllCareers = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const resultPerPage = 20;
    const apiFeatures = new CareerApiFeatures(CareerPost.find(), req.query)
        .search()
        .filter()
        .searchByLocation()
        .searchByExperience()
        .searchByType()  // Added search by type
        .sortByLatest()
        .pagination(resultPerPage);

    const careers = await apiFeatures.query.exec();

    res.status(200).json({
        success: true,
        count: careers.length,
        careers,
        resultPerPage
    });
});




export const getCareerDetails = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const title = req.params.jobTitle;

    // Find property by title
    const career = await CareerPost.findOne({ title });

    if (!career) {
        return next(new ErrorHandler("Career not found", 404));
    }

    // Populate 'listedBy' field with 'name', 'email', and 'role'


    // Respond with property details
    return res.status(200).json({
        success: true,
        career,
    });
});