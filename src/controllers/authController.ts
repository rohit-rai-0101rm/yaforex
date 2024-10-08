import { sendVerificationCode, verifyCode } from '../utils/twilio.js';
import { Request, Response, NextFunction } from 'express';
export const requestPhoneVerification = async (req: Request<{}>, res: Response, next: NextFunction) => {
    const { phoneNumber } = req.body;

    console.log("phoneNumber", phoneNumber)

    try {
        const verification = await sendVerificationCode(phoneNumber);
        res.status(200).json({ success: true, message: "Verification code sent", verification });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Error sending verification code", error });
    }
};

export const verifyPhoneNumber = async (req: Request<{}>, res: Response) => {
    const { phoneNumber, code } = req.body;

    try {
        const verificationCheck = await verifyCode(phoneNumber, code);
        if (verificationCheck.status === "approved") {
            res.status(200).json({ success: true, message: "Phone number verified" });
        } else {
            res.status(400).json({ success: false, message: "Invalid verification code" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error verifying phone number", error });
    }
};
