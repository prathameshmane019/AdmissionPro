import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/connectDb";
import Cluster from '@/app/model/cluster';
import Faculty from '@/app/model/faculty';
import Student from '@/app/model/student';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const facultyId = searchParams.get('id');

    if (!facultyId) {
      return NextResponse.json({ message: 'Faculty ID is required' }, { status: 400 });
    }

    await connectMongoDB();

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return NextResponse.json({ message: 'Faculty not found' }, { status: 404 });
    }

    const clusterId = faculty.cluster;

    const cluster = await Cluster.findById(clusterId);
    const facultyCount = await Faculty.countDocuments({ clusterid: cluster });
    const studentCount = await Student.countDocuments({ clusterid: cluster });

     const branchStats = await Student.aggregate([
      { $match: { cluster: clusterId, remark: { $ne: null } } }, // Filter by cluster_id and where remark is not null
      { $group: { _id: "$remark", count: { $sum: 1 } } } // Group by remark and count occurrences
    ]);

     const formattedBranchStats = branchStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const pieChartData = await Cluster.aggregate([
      { $match: { _id: clusterId } }, // Filter by cluster_id
      { $unwind: "$student_ids" }, // Unwind the student_ids array
      { $group: { _id: "$name", count: { $sum: 1 } } }, // Group by name and count occurrences
      { $project: { _id: 0, name: "$_id", count: 1 } } // Project name and count fields
    ]);

    return NextResponse.json({
      cluster: cluster.name,
      facultyCount,
      studentCount,
      branchStats: formattedBranchStats, // Send the formatted branchStats
      pieChartData // Send pie chart data for students in different clusters
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
