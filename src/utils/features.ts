import mongoose from 'mongoose'
import { Query, Document } from 'mongoose';
import { QueryStr } from '../types/types.js';
export const connectDB = (uri: string) => {
    mongoose.connect(uri, {
        dbName: "YaHomes"
    }).then(c => console.log(`Db connected to ${c.connection.host}`)).catch((e) => console.log(e))
}



export class ApiFeatures<T extends Document> {
    query: Query<T[], T>;
    queryStr: QueryStr;

    constructor(query: Query<T[], T>, queryStr: QueryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search(): this {
        const keyword = this.queryStr.keyword
            ? {
                title: {
                    $regex: this.queryStr.keyword,
                    $options: 'i',
                },
            }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter(): this {
        const queryCopy = { ...this.queryStr };
        // Removing some fields for category
        const removeFields = ['keyword', 'page', 'limit'];

        removeFields.forEach((key) => delete queryCopy[key]);

        // Filter for price and other numeric fields
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    searchByState(): this {
        const state = this.queryStr.state as string;
        if (state) {
            this.query = this.query.find({
                'address.state': {
                    $regex: state,
                    $options: 'i'
                }
            });
        }
        return this;
    }

    searchByCity(): this {
        const city = this.queryStr.city as string;
        if (city) {
            this.query = this.query.find({
                'address.city': {
                    $regex: city,
                    $options: 'i'
                }
            });
        }
        return this;
    }

    searchByRole(): this {
        const role = this.queryStr.role as string;
        if (role) {
            this.query = this.query.find({
                'listedBy.role': {
                    $regex: role,
                    $options: 'i'
                }
            });
        }
        return this;
    }


    searchByJobTitle(): this {
        const jobTitle = this.queryStr.role as string;
        if (jobTitle) {
            this.query = this.query.find({
                'jobTitle': {
                    $regex: jobTitle,
                    $options: 'i'
                }
            });
        }
        return this;
    }
    sortByLatest(): this {
        this.query = this.query.sort({ createdAt: -1 }); // Sort by createdAt in descending order
        return this;
    }

    pagination(resultPerPage: number): this {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}




//Career api Features

export class CareerApiFeatures<T extends Document> {
    query: Query<T[], T>;
    queryStr: QueryStr;

    constructor(query: Query<T[], T>, queryStr: QueryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search(): this {
        const keyword = this.queryStr.keyword
            ? {
                jobTitle: {
                    $regex: this.queryStr.keyword,
                    $options: 'i',
                },
            }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter(): this {
        const queryCopy = { ...this.queryStr };
        // Removing some fields for category
        const removeFields = ['keyword', 'page', 'limit'];

        removeFields.forEach((key) => delete queryCopy[key]);

        // Filter for experience and other fields if needed
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    searchByLocation(): this {
        const location = this.queryStr.location as string;
        if (location) {
            this.query = this.query.find({
                location: {
                    $regex: location,
                    $options: 'i'
                }
            });
        }
        return this;
    }

    searchByExperience(): this {
        const experience = this.queryStr.experience as string;
        if (experience) {
            this.query = this.query.find({
                experience: {
                    $regex: experience,
                    $options: 'i'
                }
            });
        }
        return this;
    }

    searchByType(): this {
        const type = this.queryStr.type as string;
        if (type) {
            this.query = this.query.find({
                type: {
                    $regex: type,
                    $options: 'i'
                }
            });
        }
        return this;
    }

    sortByLatest(): this {
        this.query = this.query.sort({ createdAt: -1 }); // Sort by createdAt in descending order
        return this;
    }

    pagination(resultPerPage: number): this {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}





//Tips Filter


export class TipApiFeatures<T extends Document> {
    query: Query<T[], T>;
    queryStr: QueryStr;

    constructor(query: Query<T[], T>, queryStr: QueryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search(): this {
        const keyword = this.queryStr.keyword
            ? {
                title: {
                    $regex: this.queryStr.keyword,
                    $options: 'i',
                },
            }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter(): this {
        const queryCopy = { ...this.queryStr };
        // Removing some fields for category
        const removeFields = ['keyword', 'page', 'limit'];

        removeFields.forEach((key) => delete queryCopy[key]);

        // Filter for tip type if needed
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    searchByType(): this {
        const type = this.queryStr.type as string;
        if (type) {
            this.query = this.query.find({
                type: {
                    $regex: type,
                    $options: 'i'
                }
            });
        }
        return this;
    }

    sortByLatest(): this {
        this.query = this.query.sort({ createdAt: -1 }); // Sort by createdAt in descending order
        return this;
    }

    pagination(resultPerPage: number): this {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}