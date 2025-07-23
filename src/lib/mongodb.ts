import mongoose from 'mongoose';

// Extend the global object to include mongoose
declare global {
    var mongoose: {
        conn: mongoose.Connection | null;
        promise: Promise<mongoose.Connection> | null;
    };
}

// Check if MONGODB_URI environment variable exists
if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

// Initialize the cached object
let cached = globalThis.mongoose;

if (!cached) {
    cached = globalThis.mongoose = { conn: null, promise: null };
}

async function connectMongo(): Promise<mongoose.Connection> {
    // If we already have a connection, return it
    if (cached.conn) {
        console.log('Using existing MongoDB connection');
        return cached.conn;
    }

    // If we don't have a promise, create one
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('New MongoDB connection established');
            return mongoose.connection;
        });
    }

    try {
        // Wait for the promise to resolve and cache the connection
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        // Reset the promise if there's an error
        cached.promise = null;
        console.error('MongoDB connection error:', error);
        throw new Error('Failed to connect to MongoDB');
    }
}

export default connectMongo;