import express from 'express';
import { requestPhoneVerification, verifyPhoneNumber } from '../controllers/authController.js';

const router = express.Router();

// Route to request a verification code
router.post('/request-verification', requestPhoneVerification);

// Route to verify the code
router.post('/verify-code', verifyPhoneNumber);

export default router;
