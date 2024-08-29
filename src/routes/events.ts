import express from "express"
import { deleteUser, getAllUsers, getUser, loginUser, newUser, updateUserRole } from "../controllers/user.js";
import { authorizeRoles, isAuthenticated, } from "../middlewares/auth.js";
import { getAllEvents, getEventDetails, newEventPost } from "../controllers/events.js";






const router = express.Router();

router.route("/new").post(isAuthenticated, authorizeRoles("superadmin"), newEventPost);


router.route("/list").get(getAllEvents);


router.route("/:title").get(getEventDetails);




// router.route("/super-admin/user/:id").get(getUser).delete(isAuthenticated, authorizeRoles("superadmin"), deleteUser);




export default router