import { NextFunction, Request, Response } from "express";
import { StringExpressionOperatorReturningBoolean } from "mongoose";

export interface NewUserRequestBody {
    name: string,
    email: string,
    password: string
}

export type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;



export interface LoginUserRequestBody {

    email: string,
    password: string
}


export interface AuthRequest extends Request {
    user?: {
        role: string; // Adjust according to your actual user role structure
        // Add any other properties of the user if needed
    };
}



export interface updateUserRoleRequestBody {

    email: string,
    name: string,
    role: "admin" | "user" | "broker" | "owner" | "builder" | "superadmin";
}






export interface NewPropertyRequestBody {
    title: string;
    description: string;
    propertyType: "1 BHK" | "2 BHK" | "3 BHK" | "PG" | "villa" | "studio" | "plot" | "penthouse" | "duplex" | "farmhouse" | "independent house" | "commercial office" | "commercial shop";
    category: "buy" | "rent" | "commercial";
    status: "available" | "sold" | "under construction" | "rented";
    price: number;
    address: {
        street: string;
        city: string;
        state: string;
        pinCode: string;
        country: string;
        latitude: number;
        longitude: number;
    };
    size: number;
    bedrooms: number;
    bathrooms: number;
    postedBy: string
    floors: number;
    yearBuilt: number;
    condition?: "new" | "good" | "needs renovation";
    amenities: string[];
    furnishingStatus?: "furnished" | "semi-furnished" | "unfurnished";
    parking?: string;
    images: { public_id: string; url: string; }[];
    videos?: string[];
    virtualTour?: string;

    ownerDetails: {
        name: string;
        phone: string;
    };
    brokerDetails?: {
        name: string;
        phone: string;
    };
    builderDetails?: {
        name: string;
        phone: string;
    };
    emiOptions?: {
        durationMonths: number;
        interestRate: number;
        downPayment: number;
    }[];
    nearbyPlaces?: {
        type: string;
        name: string;
        distance: number;
    }[];
    listedBy: "admin" | "broker" | "owner" | "agent" | "builder";
    isLuxuryProperty?: boolean;
}

export interface UpdatePropertyRequestBody {

    id: string
    title?: string;
    description?: string;
    propertyType?: "1 BHK" | "2 BHK" | "3 BHK" | "PG" | "villa" | "studio" | "plot" | "penthouse" | "duplex" | "farmhouse" | "independent house" | "commercial office" | "commercial shop";
    category?: "buy" | "rent" | "commercial";
    status?: "available" | "sold" | "under construction" | "rented";
    price?: number;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        pinCode?: string;
        country?: string;
        latitude?: number;
        longitude?: number;
    };
    size?: number;
    bedrooms?: number;
    bathrooms?: number;
    floors?: number;
    yearBuilt?: number;
    condition?: "new" | "good" | "needs renovation";
    amenities?: string[];
    furnishingStatus?: "furnished" | "semi-furnished" | "unfurnished";
    parking?: string;
    images?: { public_id: string; url: string; }[];
    videos?: string[];
    virtualTour?: string;
    owner?: string; // Assuming owner is stored as string ID
    ownerDetails?: {
        name?: string;
        phone?: string;
    };
    brokerDetails?: {
        name?: string;
        phone?: string;
    };
    builderDetails?: {
        name?: string;
        phone?: string;
    };

    listedBy?: "admin" | "broker" | "owner" | "agent" | "builder";
}


export interface Params {
    id: string;
}


export interface IReview {
    _id: string;
    // Other properties of review
}


export interface QueryStr {
    keyword?: string;
    page?: string;
    limit?: string;
    [key: string]: any;
}



//blog types interface


export interface NewBlogPostRequestBody {
    title: string;

    content: string;

    author: {
        name: string;
        email: string;
    };

    publishedAt?: Date;
}