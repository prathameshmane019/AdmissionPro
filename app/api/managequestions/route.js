import { connectMongoDB } from "@/lib/connectDb";
import { NextResponse } from "next/server";
import Questions from "@/app/models/questions";

export async function GET(req) {
    try {
        const {searchParams} = new URL(req.url);
        const _id = searchParams.get("_id");
        
        await connectMongoDB();
        await Questions.findOneAndDelete({_id:_id});
        console.log("Record Deleted Successfully");
        
        return NextResponse.json({message: "Record Deleted Successfully" });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message });
    }
  }