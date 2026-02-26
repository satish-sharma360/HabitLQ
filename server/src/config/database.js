import mongoose from "mongoose";

const connectToDb = async () => {
    if (!process.env.MONGO_URL) {
        console.error("❌ Database Connection String Error: MONGO_URL is missing.");
        process.exit(1); 
    }
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ Database connected...");
    } catch (err) {
        console.log("❌ Connection failed", err);
        process.exit(1); 
    }
};

export default connectToDb;