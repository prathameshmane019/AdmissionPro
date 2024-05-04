import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/connectDb";
import Questions from "@/app/models/questions";

export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        console.log(data);
        const newQuestions = new Questions(data);
        await newQuestions.save();
        console.log("Questions added Successfully");
        console.log(newQuestions);
        return NextResponse.json({ message: "Questions added Successfully", Quetions: newQuestions });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to add questions" });
    }
}
