import mongoose, { Mongoose } from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {//void is telling i am not interested in what type of data i am expecting in return from this function
    if(connection.isConnected){
        console.log("Already connected to database")
        return
    }

    try {
        const db = await mongoose.connect(process.env.
            MONGODB_URI || '', {})

            connection.isConnected = db.connections[0].readyState

            console.log("db connected successfully")
    } catch (error) {
        console.log("Database connection Failed", error)

        process.exit(1)
    }
}

export default dbConnect