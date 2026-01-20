import mongoose from 'mongoose';
import { application } from '../config/application';

const MONGODB_URI = application.MONGODB_URI;

if (!MONGODB_URI)
{
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    )
}


let cached = (global as any).mongoose;

if (!cached)
{
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function dbConnect()
{
    if (cached.conn)
    {
        return cached.conn;
    }

    if (!cached.promise)
    {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        }).then(mongoose => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}