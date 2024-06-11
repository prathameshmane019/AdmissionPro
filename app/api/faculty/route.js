import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/connectDb";
import Faculty from "@/app/model/faculty";
import Cluster from "@/app/model/cluster";

export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        console.log(data);
        const {
            name,
            gender,
            department,
            role,
            email,
            mobile,
            pwd
        } = data;

        const newFaculty = new Faculty({
            name,
            gender,
            department,
            role,
            email,
            mobile,
            pwd
        });

        await newFaculty.save();

        console.log("Faculty created successfully");
        return NextResponse.json({ message: "Faculty created successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error creating faculty:", error);
        return NextResponse.json({ error: "Failed to create faculty" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        await connectMongoDB();

        const faculty = id ? await Faculty.findById(id) : await Faculty.find();
        console.log("Faculty fetched successfully");
        console.log(faculty);

        return NextResponse.json(faculty, { status: 200 });
    } catch (error) {
        console.error("Error fetching faculty:", error);
        return NextResponse.json({ error: "Failed to fetch faculty" }, { status: 500 });
    }
}
export async function DELETE(req) {
    try {
        await connectMongoDB();

        const { searchParams } = new URL(req.url);
        const facultyId = searchParams.get("id");

        // Find all clusters where faculty_ids contains the facultyId and update them
        const clustersToUpdate = await Cluster.find({ faculty_ids: facultyId });

        // Update each cluster to remove the facultyId from faculty_ids
        await Promise.all(clustersToUpdate.map(async (cluster) => {
            cluster.faculty_ids = cluster.faculty_ids.filter(id => id.toString() !== facultyId);
            await cluster.save();
        }));

        // Now, delete the faculty record
        const deletedFaculty = await Faculty.findByIdAndDelete(facultyId);

        if (!deletedFaculty) {
            return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
        }

        console.log("Faculty deleted successfully", deletedFaculty);
        return NextResponse.json({ message: "Faculty deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting faculty:", error);
        return NextResponse.json({ error: "Failed to delete faculty" }, { status: 500 });
    }
}
export async function PUT(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        const _id = searchParams.get("id");

        const data = await req.json();
        console.log(data);
        const {
            name,
            gender,
            department,
            role,
            email,
            mobile,
            pwd
        } = data;

        const updatedFaculty = await Faculty.findByIdAndUpdate(
            _id,
            {
                name,
                gender,
                department,
                role,
                email,
                mobile,
                pwd
            },
            { new: true }
        );

        if (!updatedFaculty) {
            return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
        }

        console.log("Faculty updated successfully", updatedFaculty);
        return NextResponse.json({ message: "Faculty updated successfully", faculty: updatedFaculty }, { status: 200 });
    } catch (error) {
        console.error("Error updating faculty:", error);
        return NextResponse.json({ error: "Failed to update faculty" }, { status: 500 });
    }
}
