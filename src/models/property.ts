import mongoose, { Schema, Document, model } from 'mongoose';

export interface IReview extends Document {
    user: mongoose.Schema.Types.ObjectId;
    _id: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}

export interface IEMIOption extends Document {
    durationMonths: number;
    interestRate: number;
    downPayment: number;
}

export interface INearbyPlace extends Document {
    type: string;
    name: string;
    distance: number;
}

const addressSchema = new Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    country: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
});

const reviewSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const emiOptionSchema = new Schema({
    durationMonths: {
        type: Number,
        required: true
    },
    interestRate: {
        type: Number,
        required: true
    },
    downPayment: {
        type: Number,
        required: true
    }
});

const nearbyPlaceSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    distance: {
        type: Number,
        required: true
    }
});


const ownerDetailsSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    // Add other fields as needed
});

const brokerDetailsSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    // Add other fields as needed
});

const builderDetailsSchema = new Schema({
    name: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    // Add other fields as needed
});

interface IImage extends Document {
    public_id: string;
    url: string;
}

export interface IProperty extends Document {
    title: string;
    _id?: string,
    description: string;
    propertyType: "1 BHK" | "2 BHK" | "3 BHK" | "PG" | "villa" | "studio" | "plot" | "penthouse" | "duplex" | "farmhouse" | "independent house" | "commercial office" | "commercial shop" | "apartment" | "investment property" | "warehouse" | "event venue";
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
    size: number; // in square feet or meters
    bedrooms: number;
    bathrooms: number;
    floors: number;
    yearBuilt: number;
    condition?: "new" | "good" | "needs renovation";
    amenities: string[];
    furnishingStatus?: "furnished" | "semi-furnished" | "unfurnished";
    parking?: string;
    images: IImage[];
    videos?: string[];
    virtualTour?: string;
    // owner: mongoose.Schema.Types.ObjectId;
    ownerDetails?: {
        name: string;
        phone: string;
    };
    brokerDetails?: {
        name: string;
        phone: string;
    };
    builderDetails?: {
        name: string;
        licenseNumber: string;
    };

    ratingsAverage: number;
    ratingsQuantity: number;
    reviews: IReview[];
    emiOptions: IEMIOption[];
    nearbyPlaces: INearbyPlace[];
    listedBy: mongoose.Schema.Types.ObjectId; // Reference to the user model who listed the property
    createdAt: Date;
    updatedAt: Date;
}

const propertySchema: Schema = new Schema(
    {
        title: {
            type: String,
            unique: true,
            required: [true, "Please enter the property title"],
            maxLength: [100, "Title cannot exceed 100 characters"]
        },
        postedBy: {
            type: String,

            required: [true, "Please enter the user role"],

        },

        description: {
            type: String,
            required: [true, "Please enter the property description"],
        },
        propertyType: {
            type: String,
            enum: ["1 BHK", "2 BHK", "3 BHK", "PG", "villa", "studio", "plot", "penthouse", "duplex", "farmhouse", "independent house", "commercial office", "commercial shop", "apartment", "investment property", "warehouse", "event venue"],
            required: [true, "Please select the property type"],
        },
        category: {
            type: String,
            enum: ["buy", "rent", "commercial", "luxury property"],
            required: [true, "Please select the property category"],
        },
        status: {
            type: String,
            enum: ["available", "sold", "under construction", "rented"],
            default: "available",
        },
        price: {
            type: Number,
            required: [true, "Please enter the property price"],
        },
        address: {
            type: addressSchema,
            required: true
        },
        size: {
            type: Number,
            required: [true, "Please enter the property size"],
        },
        bedrooms: {
            type: Number,
            required: true,
        },
        bathrooms: {
            type: Number,
            required: true,
        },
        floors: {
            type: Number,
            required: true,
        },
        yearBuilt: {
            type: Number,
            required: true,
        },
        condition: {
            type: String,
            enum: ["new", "good", "needs renovation"],
            default: "good",
        },
        amenities: {
            type: [String],
            default: [],
        },
        furnishingStatus: {
            type: String,
            enum: ["furnished", "semi-furnished", "unfurnished"],
            default: "unfurnished",
        },
        parking: {
            type: String,
            default: null,
        },
        images: {
            type: [{
                public_id: { type: String, required: true },
                url: { type: String, required: true }
            }],
            required: [true, "Please upload images of the property"],
        },
        videos: {
            type: [String],
            default: [],
        },
        virtualTour: {
            type: String,
            default: null,
        },


        ownerDetails: ownerDetailsSchema, // Optional owner details
        brokerDetails: brokerDetailsSchema, // Optional broker details
        builderDetails: builderDetailsSchema, // Optional builder details
        ratingsAverage: {
            type: Number,
            default: 0
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        reviews: {
            type: [reviewSchema],
            default: []
        },
        emiOptions: {
            type: [emiOptionSchema],
            default: []
        },
        nearbyPlaces: {
            type: [nearbyPlaceSchema],
            default: []
        },
        listedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }, isLuxuryProperty: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

export const Property = model<IProperty>("Property", propertySchema);
