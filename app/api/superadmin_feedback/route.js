import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/connectDb";
import Feedback from "@/app/models/superadmin_feedback";

export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        console.log(data);

        const { feedbackTitle, class: className, department, feedbackType, questions, pwd, isActive } = data;

        const newFeedback = new Feedback({
            feedbackTitle,
            class: className,
            department,
            feedbackType,
            questions,
            pwd,
            isActive: isActive || false, // Set isActive to false if not provided
        });

        await newFeedback.save();
        console.log("Feedback Created Successfully");
        console.log(newFeedback);
        return NextResponse.json({ message: "Feedback Created Successfully", feedback: newFeedback });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to create feedback" });
    }
}
