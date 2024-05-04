import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/connectDb";
import Department from "@/app/models/department";

export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        console.log(data);

        const {  department, username, password,classes } = data;

        const newRegister = new Department({
            department,
            classes,
            _id:username,
            password

        });

        await newRegister.save();
        console.log("Department Registered Successfully");
        console.log(newRegister);
        return NextResponse.json({ message: "Department Registered Successfully", register: newRegister });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to  Register" });
    }
}
