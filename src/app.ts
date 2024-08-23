import express from 'express'
import { config } from "dotenv";
import cookieParser from "cookie-parser";

import cors from 'cors'
//importing routes

import userRoutes from "./routes/user.js"

import propertyRoutes from "./routes/property.js"
import blogRoutes from "./routes/blogs.js"
import newsRoutes from "./routes/news.js"
import eventsRoutes from "./routes/events.js"
import guidesRoutes from "./routes/guide.js"
import careerRoutes from "./routes/career.js"
import { connectDB } from './utils/features.js';
import { errorMiddleWare } from './middlewares/error.js';

import * as cloudinary from "cloudinary";


config({
    path: "./.env",
});
const port = process.env.PORT
const mongoURI = process.env.MONGO_URI || "";
connectDB(mongoURI);
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});


const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("API Working with /api/v1");
});

//using middlewares


//using routes
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/property", propertyRoutes)
app.use("/api/v1/blog", blogRoutes)
app.use("/api/v1/news", newsRoutes)
app.use("/api/v1/events", eventsRoutes)
app.use("/api/v1/guides", guidesRoutes)
app.use("/api/v1/carrer", careerRoutes)
app.use(errorMiddleWare)
app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`)
})