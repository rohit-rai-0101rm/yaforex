import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import { sendVerificationCode, verifyCode } from "../utils/twilio.js";

export const requestPhoneVerification = TryCatch(async (req, res) => {
    const { phoneNumber } = req.body;

    console.log("phoneNumber", phoneNumber);

    const verification = await sendVerificationCode(phoneNumber);
    res.status(200).json({ success: true, message: "Verification code sent", verification });
});
export const verifyPhoneNumber = TryCatch(async (req, res) => {
    const { phoneNumber, code } = req.body;

    const verificationCheck = await verifyCode(phoneNumber, code);
    if (verificationCheck.status === "approved") {
        // Check if the user already exists
        let user = await User.findOne({ mobileNumber: phoneNumber });

        if (!user) {
            // Create a new user
            user = await User.create({
                mobileNumber: phoneNumber,
                balance: 1000, // Default balance
                isVerified: true, // Set verified
            });
        } else {
            // Update user if already exists
            user.isVerified = true; // Set verified
            await user.save();
        }

        res.status(200).json({ success: true, message: "Phone number verified", user });
    } else {
        res.status(400).json({ success: false, message: "Invalid verification code" });
    }
});







export const getAllUsers = TryCatch(async (req, res) => {
    const users = await User.find({});
    res.status(200).json({ success: true, users });
});