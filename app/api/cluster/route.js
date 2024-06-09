import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/connectDb";
import Cluster from "@/app/model/cluster";
import Student from "@/app/model/student";
import Faculty from "@/app/model/faculty";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { title, student_ids = [], faculty_ids = [] } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const existingCluster = await Cluster.findOne({ name:title });
    if (existingCluster) {
      return NextResponse.json({ error: "Cluster with the same title already exists" }, { status: 400 });
    }

    const newCluster = new Cluster({
      name:title,
      student_ids,
      faculty_ids,
    });

    await newCluster.save();
    return NextResponse.json({ message: "Cluster created successfully", cluster: newCluster }, { status: 201 });
  } catch (error) {
    console.error("Error creating cluster:", error);
    return NextResponse.json({ error: "Failed to create cluster" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const clusters = id ? await Cluster.findById(id) : await Cluster.find();
    if (!clusters) {
      return NextResponse.json({ error: "Cluster not found" });
    }

    return NextResponse.json(clusters);
  } catch (error) {
    console.error("Error fetching clusters:", error);
    return NextResponse.json({ error: "Failed to fetch clusters" });
  }
}


export async function DELETE(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const clusterId = searchParams.get('id');
    const { id, type } = await req.json();

    const cluster = await Cluster.findById(clusterId);
    if (!cluster) {
      return NextResponse.json({ error: "Cluster not found" });
    }

    if (type === 'faculty') {
      const faculty = await Faculty.findById(id);
      if (faculty) {
        faculty.cluster = null;
        await faculty.save();
        cluster.faculty_ids = cluster.faculty_ids.filter(facultyId => facultyId.toString() !== id);
      }
    } else if (type === 'student') {
      const student = await Student.findById(id);
      if (student) {
        student.cluster = null;
        await student.save();
        cluster.student_ids = cluster.student_ids.filter(studentId => studentId.toString() !== id);
      }
    } else {
      return NextResponse.json({ error: "Invalid type specified" }, { status: 405 });
    }

    await cluster.save();
    return NextResponse.json({ message: "Data deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json({ error: "Failed to delete data" }, { status: 500 });
  }
}
