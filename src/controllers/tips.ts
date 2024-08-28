import { TryCatch } from "../middlewares/error.js";
import { NewTipRequestBody } from "../types/types.js";
import { Request, Response, NextFunction } from 'express';
import ErrorHandler from "../utils/utility-class.js";
import sanitizeHtml from 'sanitize-html';
import { ITip, Tip } from "../models/Tips.js";


export const newTip = TryCatch(
    async (req: Request<{}, {}, NewTipRequestBody>, res: Response, next: NextFunction) => {
        const { title, content, author, type } = req.body;

        // Validate required fields
        if (!title || !content || !author || !author.name || !author.email || !type) {
            return next(new ErrorHandler("Please fill in all required fields", 400));
        }

        // Ensure the type is valid (enum check)
        const validTypes = ['buying', 'selling', 'investment', 'legal', 'market-trends'];
        if (!validTypes.includes(type)) {
            return next(new ErrorHandler("Invalid tip type", 400));
        }

        // Sanitize HTML content to prevent XSS or malicious scripts
        const sanitizedContent = sanitizeHtml(content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'iframe', 'video']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                '*': ['style', 'class', 'id']
            }
        });

        // Check if the tip title already exists (unique constraint)
        const existingTip = await Tip.findOne({ title });
        if (existingTip) {
            return next(new ErrorHandler("A tip with this title already exists", 400));
        }

        // Create new tip
        const newTip = await Tip.create({
            title,
            content: sanitizedContent,
            author,
            type
        });

        // Prepare response object
        const responseTip: ITip = {
            ...newTip.toJSON(),
        };

        return res.status(201).json({
            success: true,
            message: `Tip '${newTip.title}' created successfully`,
            tip: responseTip,
        });
    }
);



export const getAllTips = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    // Fetch all tips from the database
    const tips = await Tip.find();

    if (!tips || tips.length === 0) {
        return next(new ErrorHandler('No tips found', 404));
    }

    // Send the list of tips to the client
    return res.status(200).json({
        success: true,
        tips,
    });
});