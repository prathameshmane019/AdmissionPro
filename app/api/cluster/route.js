import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/connectDb";
import Cluster from "@/app/model/cluster";
import Student from "@/app/model/student"; // Assuming you have a Student model

export async function POST(req, res) {
  try {
    await connectMongoDB();
    const { filters, title } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "Title is required" });
    }
    const query = {};
    if (filters.category) query.category = filters.category;
    if (filters.gender) query.gender = filters.gender;
    if (filters.pcm) query.pcm = { $gte: Number(filters.pcm) };
    if (filters.cet) query.cet = { $gte: Number(filters.cet) };
    if (filters.jee) query.jee = { $gte: Number(filters.jee) };
    if (filters.hsc) query.hsc = { $gte: Number(filters.hsc) };
    if (filters.address) query.address = new RegExp(filters.address, "i"); // Case-insensitive regex search

    const students = await Student.find(query).select('firstName middleName lastName');

    const student_names = students.map(student => `${student.firstName} ${student?.middleName} ${student.lastName}`);

    let cluster = await Cluster.findOne({ _id: title });
    if (!cluster) {
      cluster = new Cluster({ _id: title, student_names: [] });
    }

    // Add new student names to the cluster
    cluster.student_names = [...new Set([...cluster.student_names, ...student_names])];

    // Save the cluster
    await cluster.save();

    return NextResponse.json({ message: "Data clustered and saved successfully!" });
  } catch (error) {
    console.error("Error clustering data:", error);
    return NextResponse.json({ error: "Failed to cluster data" });
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const clusters = await Cluster.find();
    return NextResponse.json(clusters);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch clusters" });
  }
}

export async function PUT(req) {
  try {
    await connectMongoDB();
    const { clusterId, name, type } = await req.json();

    const cluster = await Cluster.findById(clusterId);
    if (!cluster) {
      return NextResponse.json({ error: "Cluster not found" });
    }

    if (type === 'faculty') {
      cluster.faculty_names.push(name);
    } else {
      cluster.student_names.push(name);
    }

    await cluster.save();

    return NextResponse.json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json({ error: "Failed to update data" });
  }
}

export async function DELETE(req) {
  try {
    await connectMongoDB();
    const { clusterId, name, type } = await req.json();

    const cluster = await Cluster.findById(clusterId);
    if (!cluster) {
      return NextResponse.json({ error: "Cluster not found" });
    }

    if (type === 'faculty') {
      cluster.faculty_names = cluster.faculty_names.filter(faculty => faculty !== name);
    } else {
      cluster.student_names = cluster.student_names.filter(student => student !== name);
    }

    await cluster.save();

    return NextResponse.json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json({ error: "Failed to delete data" });
  }
}