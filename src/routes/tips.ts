import express from "express"
import { deleteUser, getAllUsers, getUser, loginUser, newUser, updateUserRole } from "../controllers/user.js";
import { authorizeRoles, isAuthenticated, } from "../middlewares/auth.js";
import { newTip } from "../controllers/tips.js";
const router = express.Router();

router.route("/new").post(isAuthenticated, authorizeRoles("superadmin"), newTip);
export default router