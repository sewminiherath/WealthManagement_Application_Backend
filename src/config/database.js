const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * 
 * Establishes a connection to MongoDB using the connection string from environment variables.
 * Uses Mongoose ODM with new URL parser and unified topology options.
 * Logs success message with host and database name on successful connection.
 * Exits the process with error code 1 if connection fails.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when connected successfully
 * @throws {Error} Throws error if MongoDB connection fails and exits process
 * 
 * @example
 * // In server.js
 * const connectDB = require('./config/database');
 * connectDB(); // Connects to MongoDB
 * 
 * @requires MONGODB_URI environment variable to be set in .env file
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;


