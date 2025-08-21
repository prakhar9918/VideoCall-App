const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB Atlas with Mongoose");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectDB;
