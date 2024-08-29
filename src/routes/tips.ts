import express from "express"
import { deleteUser, getAllUsers, getUser, loginUser, newUser, updateUserRole } from "../controllers/user.js";
import { authorizeRoles, isAuthenticated, } from "../middlewares/auth.js";
import { getAllTips, getTipDetails, newTip } from "../controllers/tips.js";
const router = express.Router();

router.route("/new").post(isAuthenticated, authorizeRoles("superadmin"), newTip);
router.route("/list").get(getAllTips);

router.route("/:title").get(getTipDetails);



export default router