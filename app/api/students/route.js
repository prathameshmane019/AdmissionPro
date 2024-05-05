import { NextResponse } from "next/server";
import { connectMongoDB} from "@/app/lib/connectDb"
import Student from "@/app/model/student";

export async function POST(req) {
    try {
        await connectMongoDB();

        const data = await req.json();
        const {
            firstName,
            fatherName,
            lastName,
            motherName,
            Gender,
            dob,
            category,
            disability,
            hsc,
            SSC,
            cet,
            jee,
            pcm,
            mobile,
            parentMobile,
            gmail,
        } = data;

        const newStudent = new Student({
            firstName,
            fatherName,
            lastName,
            motherName,
            Gender,
            dob,
            category,
            disability,
            hsc,
            SSC,
            cet,
            jee,
            pcm,
            mobile,
            parentMobile,
            gmail,
        });

        await newStudent.save();

        console.log("Student created successfully");
        return NextResponse.json({ message: "Student created successfully", student: newStudent });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to create student" });
    }
}

export async function GET() {
    try {
        await connectMongoDB();

        const students = await Student.find();

        console.log("Students fetched successfully");
        console.log(students);

        return NextResponse.json({ students });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch students" });
    }
}

export async function DELETE(req) {
    try {
        await connectMongoDB();

        const { searchParams } = new URL(req.url);
        const _id = searchParams.get("_id");

        const deleted = await Student.findByIdAndDelete(_id);

        if (!deleted) {
            return NextResponse.json({ error: "Student not found" });
        }

        console.log("Student deleted successfully", deleted);
        return NextResponse.json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("Error deleting student:", error);
        return NextResponse.json({ error: "Failed to delete student" });
    }
}

export async function PUT(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        const _id = searchParams.get("_id");

        const data = await req.json();
        const {
            firstName,
            fatherName,
            lastName,
            motherName,
            Gender,
            dob,
            category,
            disability,
            hsc,
            SSC,
            cet,
            jee,
            pcm,
            mobile,
            parentMobile,
            gmail,
        } = data;

        const updatedStudent = await Student.findByIdAndUpdate(
            _id,
            {
                firstName,
                fatherName,
                lastName,
                motherName,
                Gender,
                dob,
                category,
                disability,
                hsc,
                SSC,
                cet,
                jee,
                pcm,
                mobile,
                parentMobile,
                gmail,
            },
            { new: true }
        );

        if (!updatedStudent) {
            return NextResponse.json({ error: "Student not found" });
        }

        console.log("Student updated successfully", updatedStudent);
        return NextResponse.json({ message: "Student updated successfully", student: updatedStudent });
    } catch (error) {
        console.error("Error updating student:", error);
        return NextResponse.json({ error: "Failed to update student" });
    }
}