import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/connectDb";
import Cluster from '@/app/model/cluster';
import Faculty from '@/app/model/faculty';
import Student from '@/app/model/student';

export async function GET() {
  try {
    await connectMongoDB();
    
    // Count documents
    const clusters = await Cluster.countDocuments();
    const facultyCount = await Faculty.countDocuments();
    const studentCount = await Student.countDocuments();

    // Calculate branch stats using aggregation pipeline
    const branchStats = await Student.aggregate([
      { $match: { remark: { $ne: null } } }, // Filter out documents where remark is not null
      { $group: { _id: "$remark", count: { $sum: 1 } } } // Group by remark and count occurrences
    ]);

    // Convert branchStats array to object format
    const formattedBranchStats = branchStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const pieChartData = await Cluster.aggregate([
      // Unwind the student_ids array
      { $unwind: "$student_ids" },
      // Group by name and count occurrences
      { $group: { _id: "$name", count: { $sum: 1 } } },
      // Project name and count fields
      { $project: { _id: 0, name: "$_id", count: 1 } }
    ]);

    console.log(pieChartData);
    return NextResponse.json({
      clusters,
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
