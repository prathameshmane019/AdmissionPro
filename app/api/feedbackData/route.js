import { connectMongoDB } from "@/lib/connectDb";
import { NextResponse } from "next/server";
import Feedback from "@/app/models/feedback";
export async function GET() {
    try {
        await connectMongoDB();
        const feedbackData = await Feedback.find();
        console.log(feedbackData);
        console.log("Feedback Created Successfully");
        return NextResponse.json({feedbackData});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error});
    }
}