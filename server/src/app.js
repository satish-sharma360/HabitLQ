import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import connectToDb from "./config/database.js";

import UserRoute from "./routes/user.routes.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 7777

app.use(express.json())
app.use(cors({
    origin:process.env.FRONT_END_URL,
    credentials:true
}))

app.get('/',(req,res)=>{
    res.send('Server is up...🚀')
})

app.use('/api/auth' , UserRoute)

connectToDb().then(() => {
    console.log("Database connection established...")
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`)
    })
}).catch((err) => {
    console.error("Database cannot be connected!!");
    process.exit(1)
});