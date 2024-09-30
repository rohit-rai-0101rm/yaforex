import express from 'express';
import { getAllUsers, requestPhoneVerification, verifyPhoneNumber } from '../controllers/authController.js';

const router = express.Router();

// Route to request a verification code
router.post('/request-verification', requestPhoneVerification);

// Route to verify the code
router.post('/verify-code', verifyPhoneNumber);


router.get('/users', getAllUsers);

export default router;
