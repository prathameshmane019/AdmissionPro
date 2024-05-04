import { connectMongoDB } from "@/lib/connectDb";
import { NextResponse } from "next/server";
import Questions from "@/app/models/questions";
export async function GET() {
    try {
        await connectMongoDB();
        const questions = await Questions.find();
        console.log(questions);
        console.log("Feedback Created Successfully");
        return NextResponse.json({questions});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error});
    }
}