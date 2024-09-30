// utils/utility-class.ts
export default class ErrorHandler extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }

    getErrorObject() {
        return {
            message: this.message,
            statusCode: this.statusCode,
        };
    }
}
