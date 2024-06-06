// pages/api/dashboard.js
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/connectDb";
import Cluster from '@/app/model/cluster';
import Faculty from '@/app/model/faculty';
import Student from '@/app/model/student';

export async function GET() {
  try {
    await connectMongoDB();
    const clusters = await Cluster.find().countDocuments();
    const facultyCount = await Faculty.find().countDocuments();
    const studentCount = await Student.find().countDocuments();

    return NextResponse.json({
      clusters,
      facultyCount,
      studentCount
    },{status:200});
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ message: 'Internal server error' },{status:500});
  }
}
