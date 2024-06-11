import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/connectDb";
import Student from "@/app/model/student";

export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        console.log(data);
        const newStudent = new  Student(data)
        await newStudent.save();
        console.log("Student created successfully");
        return NextResponse.json({ message: "Student created successfully", student: newStudent },{status:201});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to create student" },{status:500});
    }
}

export async function GET(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = searchParams.get("limit")
        const skip = (page - 1) * limit;

        const filters = {};
        const college = searchParams.get("college");
        if (college) filters.college = college;

        const cluster = searchParams.get("cluster");
        if (cluster) filters.cluster = cluster;
        const category = searchParams.get("category");
        if (category) filters.category = category;
        const address = searchParams.get("address");
        if (address) filters.address = { $regex: new RegExp(address, "i") };
        const gender = searchParams.get("gender");
        if (gender) filters.gender = gender;
        const search = searchParams.get("search");
        if (search){  filters.$or = [
            { firstName: { $regex: new RegExp(search, "i") } },
            { middleName: { $regex: new RegExp(search, "i") } },
            { lastName: { $regex: new RegExp(search, "i") } }, 
             { mobile: { $regex: new RegExp(search, "i") } }
        ];}
        const pcmRange = searchParams.get("pcm");
        if (pcmRange) {
            const [min, max] = pcmRange.split(",");
            filters.pcm = { $gte: parseInt(min, 10), $lte: parseInt(max, 10) };
        }
        const cetRange = searchParams.get("cet");
        if (cetRange) {
            const [min, max] = cetRange.split(",");
            filters.cet = { $gte: parseInt(min, 10), $lte: parseInt(max, 10) };
        }
        const jeeRange = searchParams.get("jee");
        if (jeeRange) {
            const [min, max] = jeeRange.split(",");
            filters.jee = { $gte: parseInt(min, 10), $lte: parseInt(max, 10) };
        }
        const hscRange = searchParams.get("hsc");
        if (hscRange) {
            const [min, max] = hscRange.split(",");
            filters.hsc = { $gte: parseInt(min, 10), $lte: parseInt(max, 10) };
        }

        const totalStudents = await Student.countDocuments(filters);
        const students = await Student.find(filters).skip(skip).limit(limit);

        console.log("Students fetched successfully");
        
        console.log(students);
        console.log("Students fetched successfully");
        return NextResponse.json({ students, total: totalStudents },{status:201});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch students" },{status:500});
    }
}

export async function PUT(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        const _id = searchParams.get("_id");
        const data = await req.json();
        const updatedStudent = await Student.findByIdAndUpdate(_id, data, { new: true });
        if (!updatedStudent) return NextResponse.json({ error: "Student not found" },{status:404});
        console.log("Student updated successfully", updatedStudent);
        return NextResponse.json({ message: "Student updated successfully", student: updatedStudent },{status:200});
    } catch (error) {
        console.error("Error updating student:", error);
        return NextResponse.json({ error: "Failed to update student" },{status:500});
    }
}

export async function DELETE(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        const _id = searchParams.get("_id");
        const clustersToUpdate = await Cluster.find({ student_ids: _id });

        // Update each cluster to remove the facultyId from faculty_ids
        await Promise.all(clustersToUpdate.map(async (cluster) => {
            cluster.student_ids = cluster.student_ids.filter(id => id.toString() !== _id);
            await cluster.save();
        }));

        const deletedStudent = await Student.findByIdAndDelete(_id);
        if (!deletedStudent) return NextResponse.json({ error: "Student not found" },{status:404});
        
        console.log("Student deleted successfully", deletedStudent);
        return NextResponse.json({ message: "Student deleted successfully", student: deletedStudent },{status:200});
    } catch (error) {
        console.error("Error deleting student:", error);
        return NextResponse.json({ error: "Failed to delete student" },{status:500});
    }
}
