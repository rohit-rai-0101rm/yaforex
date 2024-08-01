import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import { addOrUpdatePropertyReview, deleteProperty, deletePropertyReview, getAllProperties, getAllPropertyReviews, getProperty, newProperty, updateProperty } from "../controllers/property.js";



const router = express.Router();
router
    .route("/reviews")
    .get(getAllPropertyReviews)
    .delete(isAuthenticated, deletePropertyReview);
// POST /properties/new
router.post("/new", isAuthenticated, authorizeRoles("broker", "dealer", "owner"), newProperty);
router.get("/properties", getAllProperties);
// GET /properties/:id
router.get("/:title", getProperty);

// GET /properties


// router.get("/properties", getList);
router.put("/review", isAuthenticated, addOrUpdatePropertyReview)


// PUT /properties/:id
router.put("/:id", isAuthenticated, authorizeRoles("superadmin"), updateProperty);

// DELETE /properties/:id
router.delete("/:id", isAuthenticated, authorizeRoles("superadmin"), deleteProperty);



export default router;
