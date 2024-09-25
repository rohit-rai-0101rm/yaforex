import { config } from 'dotenv';
import twilio from 'twilio';

config(); // Load environment variables

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

export const sendVerificationCode = async (phoneNumber) => {
    return await client.verify.v2.services(verifyServiceSid)
        .verifications
        .create({ to: phoneNumber, channel: 'sms' });
};

export const verifyCode = async (phoneNumber, code) => {
    return await client.verify.v2.services(verifyServiceSid)
        .verificationChecks
        .create({ to: phoneNumber, code });
};
