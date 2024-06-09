import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/connectDb";
import Cluster from "@/app/model/cluster";
import Student from "@/app/model/student";
import Faculty from "@/app/model/faculty";

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

    const students = await Student.find(query).select('_id');
    const studentIds = students.map(student => student._id);

    let cluster = await Cluster.findOne({ _id: title });
    if (!cluster) {
      cluster = new Cluster({ _id: title, student_ids: [], faculty_ids: [] });
    }

    cluster.student_ids = [...new Set([...cluster.student_ids, ...studentIds])];
    await cluster.save();

    return NextResponse.json({ message: "Data clustered and saved successfully!" });
  } catch (error) {
    console.error("Error clustering data:", error);
    return NextResponse.json({ error: "Failed to cluster data" });
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

export async function PUT(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const clusterId = searchParams.get('id');
    const { action, ids, type } = await req.json();

    const cluster = await Cluster.findById(clusterId);
    if (!cluster) {
      return NextResponse.json({ error: "Cluster not found" });
    }

    if (!cluster.student_ids) cluster.student_ids = [];
    if (!cluster.faculty_ids) cluster.faculty_ids = [];

    if (action === 'add') {
      if (type === 'faculty') {
        const facultyToUpdate = await Faculty.find({ _id: { $in: ids } });
        facultyToUpdate.forEach(faculty => {
          faculty.cluster = clusterId;
          cluster.faculty_ids.push(faculty._id);
        });
        await Faculty.bulkSave(facultyToUpdate);
      } else if (type === 'student') {
        const studentsToUpdate = await Student.find({ _id: { $in: ids } });
        studentsToUpdate.forEach(student => {
          student.cluster = clusterId;
          cluster.student_ids.push(student._id);
        });
        await Student.bulkSave(studentsToUpdate);
      }
    } else if (action === 'remove') {
      if (type === 'faculty') {
        const facultyToUpdate = await Faculty.find({ _id: { $in: ids } });
        facultyToUpdate.forEach(faculty => {
          faculty.cluster = null;
          cluster.faculty_ids = cluster.faculty_ids.filter(id => id.toString() !== faculty._id.toString());
        });
        await Faculty.bulkSave(facultyToUpdate);
      } else if (type === 'student') {
        const studentsToUpdate = await Student.find({ _id: { $in: ids } });
        studentsToUpdate.forEach(student => {
          student.cluster = null;
          cluster.student_ids = cluster.student_ids.filter(id => id.toString() !== student._id.toString());
        });
        await Student.bulkSave(studentsToUpdate);
      }
    }

    await cluster.save();
    return NextResponse.json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
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
