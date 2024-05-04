import { connectMongoDB } from "@/lib/connectDb";
import { NextResponse } from "next/server";
import Response from "@/app/models/response";

export async function POST(req) {
    try {
        await connectMongoDB();

        const { feedback_id, responses } = await req.json();
       
        // Format the responses array to remove null values from ratings
        console.log(responses);
        const newResponse = new Response({
            feedback_id,
            ratings:responses,
            date: new Date() 
        });
        
        await newResponse.save();

        console.log("Response sent successfully");
        console.log(newResponse);

        // Respond with success message
        return NextResponse.json({ message: "Response saved successfully" });
    } catch (error) {
        // Handle errors and respond with error message
        console.error("Error saving response:", error);
        return NextResponse.json({ error: "Error saving response" });
    }
}
