import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/connectDb";
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
            email,
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
            email,
        });

        await newStudent.save();

        console.log("Student created successfully");
        console.log(newStudent);
        return NextResponse.json({ message: "Student created successfully", student: newStudent });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to create student" });
    }
}
export async function GET(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = 10; 
        const skip = (page - 1) * limit;

        const totalStudents = await Student.countDocuments();

        // Retrieve students for the current page
        const students = await Student.find().skip(skip).limit(limit);

        console.log("Students fetched successfully");
        console.log(students);

        return NextResponse.json({ students, total: totalStudents });
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
            email,
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
                email,
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