import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import connectToDb from "./config/database.js";

dotenv.config()

const app = express()

const PORT = process.env.PORT || 7777

app.use(express.json())
app.use(cors())

connectToDb().then(() => {
    console.log("Database connection established...")
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`)
    })
}).catch((err) => {
    console.error("Database cannot be connected!!");
    process.exit(1)
});