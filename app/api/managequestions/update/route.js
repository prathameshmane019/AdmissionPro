import { connectMongoDB } from "@/lib/connectDb";
import { NextResponse } from "next/server";
import Questions from "@/app/models/questions";

export async function PUT(req) {
    try {
        const { _id, questions } = await req.json();
        console.log(_id, questions);

        await connectMongoDB();
        await Questions.updateOne({ _id: _id }, { $set: { questions: questions } });

        console.log("Record Updated Successfully");

        return NextResponse.json({ message: "Record Updated Successfully" });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message });
    }
}
