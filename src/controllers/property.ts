import { NextFunction, Request, Response } from "express";

import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import { IProperty, IReview, Property } from "../models/property.js";
import { NewPropertyRequestBody, Params, UpdatePropertyRequestBody } from "../types/types.js";
import { User } from "../models/user.js";
import * as cloudinary from "cloudinary";
import mongoose from 'mongoose';
import ApiFeatures from "../utils/features.js";
export const newProperty = TryCatch(


    async (req: Request<{}, {}, NewPropertyRequestBody>, res: Response, next: NextFunction) => {
        let imagesFromRequest: any[] = [];
        const {
            title, description, propertyType, category, status, price, address, size,
            bedrooms, bathrooms, floors, yearBuilt, amenities, ownerDetails,
            brokerDetails, builderDetails, listedBy, images, videos, virtualTour, nearbyPlaces, emiOptions, postedBy, isLuxuryProperty
        } = req.body;

        if (!title || !description || !propertyType || !category || !status || !price || !address || !size ||
            !bedrooms || !bathrooms || !floors || !yearBuilt || !amenities || !ownerDetails || !listedBy || !postedBy || !images) {
            return next(new ErrorHandler("Please fill in all required fields", 400));
        }

        // Validate ObjectId for listedBy
        if (!mongoose.Types.ObjectId.isValid(listedBy)) {
            return next(new ErrorHandler("Invalid listedBy user ID", 400));
        }

        const listedByUser = await User.findById(listedBy);

        console.log("listedByUser", listedByUser)

        if (!listedByUser) {
            return next(new ErrorHandler("Listed user not found", 404));
        }
        if (typeof req.body.images === "string") {
            imagesFromRequest.push(req.body.images);
        } else {
            imagesFromRequest = req.body.images;
        }

        const imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(imagesFromRequest[i], {
                folder: "products",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        const property = await Property.create({
            title,
            description,
            propertyType,
            category,
            status,
            price,
            address,
            size,
            bedrooms,
            bathrooms,
            postedBy,
            floors,
            yearBuilt,
            condition: req.body.condition,
            amenities,
            ownerDetails,
            brokerDetails,
            builderDetails,
            listedBy,
            listedByUser,
            images: imagesLinks,
            videos,
            emiOptions,
            nearbyPlaces,
            virtualTour, isLuxuryProperty
        });
        console.log("createdProperty", property)
        const listedByDetails = {
            name: listedByUser.name,
            email: listedByUser.email,
            role: listedByUser.role
        };

        const responseProperty: IProperty & { listedByDetails: { name: string, email: string, role: string } } = {
            ...property.toJSON(),
            listedByDetails: listedByDetails
        };

        return res.status(201).json({
            success: true,
            message: `Property '${property.title}' created successfully`,
            property: responseProperty,
        });
    }
);


export const getAllProperties = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const resultPerPage = 20;
    const apiFeatures = new ApiFeatures(Property.find(), req.query)
        .search()
        .filter()
        .searchByCity()
        .searchByState()
        .pagination(resultPerPage);

    let properties: IProperty[] = await apiFeatures.query.populate('listedBy', 'name email role').exec();

    // Filter based on the populated `listedBy.role` field
    if (req.query.role) {



        properties = properties.filter(property =>
            (property.listedBy as any).role === req.query.role // Use `any` type assertion here
        );

        console.log("properties", properties)
    }

    res.status(200).json({
        success: true,
        count: properties.length,
        properties,
        resultPerPage
    });
});

export const getProperty = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const title = req.params.title;

    // Find property by title
    const property = await Property.findOne({ title });

    if (!property) {
        return next(new ErrorHandler("Property not found", 404));
    }

    // Populate 'listedBy' field with 'name', 'email', and 'role'
    await property.populate('listedBy', 'name email role');

    // Respond with property details
    return res.status(200).json({
        success: true,
        property,
    });
});


export const updateProperty = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const {
            title, description, propertyType, category, status, price, address, size,
            bedrooms, bathrooms, floors, yearBuilt, amenities, ownerDetails,
            brokerDetails, builderDetails, listedBy, images, videos, virtualTour
        } = req.body;

        // Validate if any fields are provided
        if (!title && !description && !propertyType && !category && !status && !price && !address &&
            !size && !bedrooms && !bathrooms && !floors && !yearBuilt && !amenities && !ownerDetails &&
            !brokerDetails && !builderDetails && !listedBy && !images && !videos && !virtualTour) {
            return next(new ErrorHandler("Please provide at least one field to update", 400));
        }

        const property = await Property.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!property) {
            return next(new ErrorHandler("Property not found", 404));
        }

        return res.status(200).json({
            success: true,
            message: `Property '${property.title}' updated successfully`,
            property,
        });
    }
);

export const deleteProperty = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const property = await Property.findByIdAndDelete(id);

    if (!property) {
        return next(new ErrorHandler("Property not found", 404));
    }

    return res.status(200).json({
        success: true,
        message: `Property '${property.title}' deleted successfully`,
    });
});


export const addOrUpdatePropertyReview = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const { rating, comment, propertyId } = req.body;

        try {
            if (!mongoose.Types.ObjectId.isValid(propertyId)) {
                throw new ErrorHandler("Invalid property ID", 400);
            }

            const property = await Property.findById(propertyId);
            if (!property) {
                throw new ErrorHandler("Property not found", 404);
            }

            const user = await User.findById(req.user._id);
            if (!user) {
                throw new ErrorHandler("User not found", 404);
            }

            const review = {
                user: req.user._id,
                rating: Number(rating),
                comment,
                createdAt: new Date(),
            };

            const existingReview = property.reviews.find(
                (rev) => rev.user.toString() === req.user._id.toString()
            );

            if (existingReview) {
                if (existingReview.user.toString() !== req.user._id.toString()) {
                    throw new ErrorHandler("You are not authorized to update this review", 403);
                }
                // Update existing review
                existingReview.rating = review.rating;
                existingReview.comment = review.comment;
                existingReview.createdAt = review.createdAt;
            } else {
                // Add new review
                property.reviews.push(review as any);
                property.ratingsQuantity = property.reviews.length;
            }

            // Calculate new ratings average
            const ratingsSum = property.reviews.reduce((sum, rev) => sum + rev.rating, 0);
            property.ratingsAverage = ratingsSum / property.reviews.length;

            // Save property with updated reviews
            await property.save({ validateBeforeSave: false });

            res.status(200).json({
                success: true,
                message: existingReview ? "Review updated successfully" : "Review added successfully",
            });
        } catch (err) {
            next(err); // Pass any errors to the error handling middleware
        }
    }
);





export const getAllPropertyReviews = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const propertyId = req.query.propertyId as string;

        try {
            if (!mongoose.Types.ObjectId.isValid(propertyId)) {
                throw new ErrorHandler('Invalid property ID', 400);
            }

            const property = await Property.findById(propertyId);

            if (!property) {
                throw new ErrorHandler('Property not found', 404);
            }

            res.status(200).json({
                success: true,
                reviews: property.reviews,
            });
        } catch (err) {
            next(err); // Pass any errors to the error handling middleware
        }
    }
);


export const deletePropertyReview = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {


        try {
            const productId = req.query.propertyId as string;
            const reviewId = req.query.reviewId as string;

            if (!mongoose.Types.ObjectId.isValid(productId)) {
                throw new ErrorHandler("Invalid property ID", 400);
            }

            const property = await Property.findById(productId);
            if (!property) {
                throw new ErrorHandler("Property not found", 404);
            }

            // Find the index of the review to delete
            const existingReviewIndex = property.reviews.findIndex(
                (rev: IReview) => rev._id.toString() === reviewId
            );

            if (existingReviewIndex === -1) {
                throw new ErrorHandler("Review not found for this user", 404);
            }

            // Remove the review from property.reviews array
            property.reviews.splice(existingReviewIndex, 1);

            // Update ratings quantity and average
            property.ratingsQuantity = property.reviews.length;
            if (property.reviews.length > 0) {
                const ratingsSum = property.reviews.reduce((sum, rev) => sum + rev.rating, 0);
                property.ratingsAverage = ratingsSum / property.reviews.length;
            } else {
                property.ratingsAverage = 0;
            }

            // Save property with updated reviews
            await property.save({ validateBeforeSave: false });

            res.status(200).json({
                success: true,
                message: "Review deleted successfully",
            });
        } catch (err) {
            next(err); // Pass any errors to the error handling middleware
        }
    }
);