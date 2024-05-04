import Department from "@/app/models/department";
import { connectMongoDB } from "@/lib/connectDb";
import { NextResponse } from "next/server";
export async function GET(req) {
    try {

        const {searchParams} = new URL(req.url);
        const _id = searchParams.get("_id");
        console.log(_id)
        await connectMongoDB();
        const user = await Department.findOne({_id} );
        console.log(user);
        console.log("Feedback Created Successfully");
        return NextResponse.json({user});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error});
    }
}