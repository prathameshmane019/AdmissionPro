import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/connectDb";
import Faculty from "@/app/model/faculty";

export async function POST(req) {
    try {
        await connectMongoDB();

        const data = await req.json();
        console.log(data);
        const {
            firstName,
            fatherName,
            lastName,
            gender,
            department,
            role,
            email,
            mobile,
        } = data;

        const newFaculty = new Faculty({
            firstName,
            fatherName,
            lastName,
            gender,
            department,
            role,
            email,
            mobile,
        });

        await newFaculty.save();

        console.log("Faculty created successfully");
        return NextResponse.json({ message: "Faculty created successfully"});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create faculty" });
    }
}

export async function GET() {
    try {
        await connectMongoDB();

        const faculty = await Faculty.find();

        console.log("Faculty fetched successfully");
        console.log(faculty);

        return NextResponse.json( faculty );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch faculty" });
    }
}

export async function DELETE(req) {
    try {
        await connectMongoDB();

        const { searchParams } = new URL(req.url);
        const _id = searchParams.get("_id");

        const deleted = await Faculty.findByIdAndDelete(_id);

        if (!deleted) {
            return NextResponse.json({ error: "Faculty not found" });
        }

        console.log("Faculty deleted successfully", deleted);
        return NextResponse.json({ message: "Faculty deleted successfully" });
    } catch (error) {
        console.error("Error deleting faculty:", error);
        return NextResponse.json({ error: "Failed to delete faculty" });
    }
}

export async function PUT(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        const _id = searchParams.get("_id");

        const data = await req.json();
        console.log(data);
        const {
            firstName,
            fatherName,
            lastName,
            gender,
            department,
            role,
            email,
            mobile,
            pwd,
            dob
        } = data;

        const updatedFaculty = await Faculty.findByIdAndUpdate(
            _id,
            {
                firstName,
                fatherName,
                lastName,
                gender,
                department,
                role,
                email,
                mobile,
                pwd,
                dob
            },
            { new: true }
        );

        if (!updatedFaculty) {
            return NextResponse.json({ error: "Faculty not found" });
        }

        console.log("Faculty updated successfully", updatedFaculty);
        return NextResponse.json({ message: "Faculty updated successfully", faculty: updatedFaculty });
    } catch (error) {
        console.error("Error updating faculty:", error);
        return NextResponse.json({ error: "Failed to update faculty" });
    }
}
