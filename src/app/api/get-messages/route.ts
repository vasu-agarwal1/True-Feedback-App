import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const _user: User = session?.user as User
    
    if(!session || !_user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },
        {status: 401}
    )
    }

    const userId = new mongoose.Types.ObjectId(_user._id)
    try {
        const userMessages = await userModel.aggregate([
            {$match: {_id: userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ]).exec()
        console.log("User Messages: ", userMessages)

        if (!userMessages || userMessages.length === 0) {
            return Response.json(
                {
                   success: true,
                   message: "No one has sent you any message yet"
                },
                {status: 200}
            )
        }

            return Response.json(
                {
                   success: true,
                   messages: userMessages[0].messages
                },
                {status: 200}
            )
    } catch (error) {
        console.error("An unexpected error occured: ", error)
        return Response.json({
            success: false,
            message: "Error in getting message"
        },
        {status: 500}
    )
        
    }
}