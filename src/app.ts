import express from 'express'
import { config } from "dotenv";
import cookieParser from "cookie-parser";

import cors from 'cors'
//importing routes


import { connectDB } from './utils/features.js';


import * as cloudinary from "cloudinary";


config({
    path: "./.env",
});
const port = process.env.PORT
const mongoURI = process.env.MONGO_URI || "";
connectDB(mongoURI);

import authRoutes from './routes/authRoutes.js';
const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("API Working with /api/v1");
});
app.use('/api/v1/auth', authRoutes);

//using middlewares



app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`)
})