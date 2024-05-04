import { connectMongoDB } from "@/lib/connectDb";
import { NextResponse } from "next/server";
import Feedback from "@/app/models/update";
import Update from "@/app/models/update";
export async function POST(req) {
    try {

        await connectMongoDB();
        const data = await req.json();
        console.log(data);
        const newUpdate = new Update(data);
        await newUpdate.save();
        console.log(newUpdate);
        console.log("Updated  Successfully");
        return NextResponse.json({message:"Updated  Successfully"},newUpdate);
    } catch (error) {
        console.log(error);
        return NextResponse.json({error});
    }
}