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
            group,
            mobile,
            parentMobile,
            email,

            address,
            branch,
            remark

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
            group,
            parentMobile,
            email,

            address,
            branch,
            remark




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

        const filters = {};

       

        const category = searchParams.get("category");
        if (category) {
            filters.category = category;
        }
        const address = searchParams.get("address");
        if (address) {
          filters.address = { $regex: new RegExp(address, "i") };
        }
        const Gender = searchParams.get("Gender");
        if (Gender) {
            filters.Gender = Gender;
        }

        const pcmRange = searchParams.get("pcm");
        if (pcmRange) {
            const [min, max] = pcmRange.split(",");
            filters.pcm = { $gte: parseInt(min, 10), $lte: parseInt(max, 10) };
        }

        // Filter by cet
        const cetRange = searchParams.get("cet");
        if (cetRange) {
            const [min, max] = cetRange.split(",");
            filters.cet = { $gte: parseInt(min, 10), $lte: parseInt(max, 10) };
        }

        // Filter by jee
        const jeeRange = searchParams.get("jee");
        if (jeeRange) {
            const [min, max] = jeeRange.split(",");
            filters.jee = { $gte: parseInt(min, 10), $lte: parseInt(max, 10) };
        }

        // Filter by hsc
        const hscRange = searchParams.get("hsc");
        if (hscRange) {
            const [min, max] = hscRange.split(",");
            filters.hsc = { $gte: parseInt(min, 10), $lte: parseInt(max, 10) };
        }

        const totalStudents = await Student.countDocuments(filters);

        // Retrieve students for the current page with filters
        const students = await Student.find(filters).skip(skip).limit(limit);

        console.log("Students fetched successfully");
        
        
        console.log(students);

        return NextResponse.json({ students, total: totalStudents });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch students" });
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
            group,
            parentMobile,
            email,

            address,
            branch,
            remark


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
                group,
                mobile,
                parentMobile,
                email,

                address,
                branch,
                remark

              
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