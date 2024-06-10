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

    return NextResponse.json({
      clusters,
      facultyCount,
      studentCount,
      branchStats: formattedBranchStats // Send the formatted branchStats
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
