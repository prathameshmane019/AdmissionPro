import { connectMongoDB } from "@/lib/connectDb";
import { NextResponse } from "next/server";
import Response from "@/app/models/response";
export async function GET(req) {
    try {
        const {searchParams} = new URL(req.url);
        const feedbackId = searchParams.get("feedbackId");
        // const _id = searchParams.get("subject");
        await connectMongoDB();
        const response = await Response.find({feedback_id:feedbackId});
        console.log(response);
        console.log("Fetched Data Successfully");
        return NextResponse.json(response);
    } catch (error) {
        console.log(error);
        return NextResponse.json({error});
    }
}