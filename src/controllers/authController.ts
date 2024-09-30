import { TryCatch } from "../middlewares/error.js";
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
        res.status(200).json({ success: true, message: "Phone number verified" });
    } else {
        res.status(400).json({ success: false, message: "Invalid verification code" });
    }
});
