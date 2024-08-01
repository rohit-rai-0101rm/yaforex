import express from "express"
import { deleteUser, getAllUsers, getUser, loginUser, newUser, updateUserRole } from "../controllers/user.js";
import { authorizeRoles, isAuthenticated, } from "../middlewares/auth.js";




const router = express.Router();
router.post("/register", newUser)
router.post("/login", loginUser)

router.get("/super-admin/users-list", isAuthenticated, authorizeRoles("superadmin"), getAllUsers);
router.route("/:id").get(getUser).delete(isAuthenticated, authorizeRoles("superadmin"), deleteUser).put(isAuthenticated, authorizeRoles("superadmin"), updateUserRole);


// router.route("/super-admin/user/:id").get(getUser).delete(isAuthenticated, authorizeRoles("superadmin"), deleteUser);




export default router