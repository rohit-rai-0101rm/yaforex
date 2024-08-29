import express from "express"
import { deleteUser, getAllUsers, getUser, loginUser, newUser, updateUserRole } from "../controllers/user.js";
import { authorizeRoles, isAuthenticated, } from "../middlewares/auth.js";
import { getAllNews, getNewsByTitle, newNewsPost } from "../controllers/news.js";





const router = express.Router();

router.route("/new").post(isAuthenticated, authorizeRoles("superadmin"), newNewsPost);
router.route("/list").get(getAllNews);
router.route("/:title").get(getNewsByTitle);



// router.route("/super-admin/user/:id").get(getUser).delete(isAuthenticated, authorizeRoles("superadmin"), deleteUser);




export default router