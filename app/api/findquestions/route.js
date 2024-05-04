import { connectMongoDB } from "@/lib/connectDb";
import { NextResponse } from "next/server";
import Questions from "@/app/models/questions";

export async function GET(req) {
    try {
        const {searchParams} = new URL(req.url);
        const type = searchParams.get("type");
        
        await connectMongoDB();
        let questions
        if(type==="academic"){
        const subtype = searchParams.get("subtype");

         questions = await Questions.find({
            feedbackType:type,
            subType:subtype});
         } 
         if(type==="event"){
            questions = await Questions.find({
               feedbackType:type});
            }
        console.log(questions);
        console.log("Feedback Created Successfully");
        
        return NextResponse.json({ questions });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message });
    }
}
