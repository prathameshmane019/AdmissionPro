import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/connectDb";
import Cluster from "@/app/model/cluster";
import Student from "@/app/model/student";

// POST - Create or update a cluster with filtered students
export async function POST(req) {
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
    if (filters.address) query.address = new RegExp(filters.address, "i");

    const students = await Student.find(query).select('firstName middleName lastName');
    const student_names = students.map(student => `${student.firstName} ${student.middleName || ''} ${student.lastName}`.trim());

    let cluster = await Cluster.findOne({ _id: title });
    if (!cluster) {
      cluster = new Cluster({ _id: title, student_names: [] });
    }

    cluster.student_names = [...new Set([...cluster.student_names, ...student_names])];
    await cluster.save();

    return NextResponse.json({ message: "Data clustered and saved successfully!" });
  } catch (error) {
    console.error("Error clustering data:", error);
    return NextResponse.json({ error: "Failed to cluster data" });
  }
}

// GET - Fetch cluster(s)
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
export async function PUT(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const clusterId = searchParams.get('id');
    const { action, names, type } = await req.json();

    const cluster = await Cluster.findById(clusterId);
    if (!cluster) {
      return NextResponse.json({ error: "Cluster not found" });
    }

    if (action === 'add') {
      if (type === 'faculty') {
        cluster.faculty_names.push(...names);
      } else if (type === 'student') {
        cluster.student_names.push(...names);
      }
    } else if (action === 'remove') {
      if (type === 'faculty') {
        cluster.faculty_names = cluster.faculty_names.filter(name => !names.includes(name));
      } else if (type === 'student') {
        cluster.student_names = cluster.student_names.filter(name => !names.includes(name));
      }
    }

    await cluster.save();
    return NextResponse.json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json({ error: "Failed to update data" });
  }
}

// DELETE - Remove faculty or student from cluster
export async function DELETE(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const clusterId = searchParams.get('id');
    const { name, type } = await req.json();

    const cluster = await Cluster.findById(clusterId);
    if (!cluster) {
      return NextResponse.json({ error: "Cluster not found" });
    }

    if (type === 'faculty') {
      cluster.faculty_names = cluster.faculty_names.filter(faculty => faculty !== name);
    } else if (type === 'student') {
      cluster.student_names = cluster.student_names.filter(student => student !== name);
    } else {
      return NextResponse.json({ error: "Invalid type specified" });
    }

    await cluster.save();
    return NextResponse.json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json({ error: "Failed to delete data" });
  }
}
