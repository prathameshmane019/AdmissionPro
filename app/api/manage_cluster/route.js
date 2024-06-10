import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/connectDb";
import Cluster from "@/app/model/cluster";
import Student from "@/app/model/student";
import Faculty from "@/app/model/faculty";

export async function GET(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Cluster ID is required" });
    }
    
    const cluster = await Cluster.findById(id).populate('student_ids').populate('faculty_ids');
    if (!cluster) {
      return NextResponse.json({ error: "Cluster not found" });
    }

    const students = await Student.find({ _id: { $in: cluster.student_ids } }, { _id: 1, firstName: 1, middleName: 1, lastName: 1 });
    const faculties = await Faculty.find({ _id: { $in: cluster.faculty_ids } }, { _id: 1, name: 1 });

    return NextResponse.json({ cluster, students, faculties });
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

    if (!clusterId || !action || !ids || !type) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    let updateAction;
    if (action === 'add') {
      updateAction = { $addToSet: { [`${type}_ids`]: { $each: ids } } };
    } else if (action === 'remove') {
      updateAction = { $pullAll: { [`${type}_ids`]: ids } };
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const cluster = await Cluster.findByIdAndUpdate(clusterId, updateAction, { new: true });
    if (!cluster) {
      return NextResponse.json({ error: "Cluster not found" }, { status: 404 });
    }

    // Update students/faculties with new clusterId
    if (action === 'add') {
      if (type === 'student') {
        await Student.updateMany({ _id: { $in: ids } }, { $set: { cluster: clusterId } });
      } else if (type === 'faculty') {
        await Faculty.updateMany({ _id: { $in: ids } }, { $set: { cluster: clusterId } });
      }
    } else if (action === 'remove') {
      if (type === 'student') {
        await Student.updateMany({ _id: { $in: ids } }, { $unset: { cluster: 1 } });
      } else if (type === 'faculty') {
        await Faculty.updateMany({ _id: { $in: ids } }, { $unset: { cluster: 1 } });
      }
    }

    return NextResponse.json({ message: "Cluster updated successfully" });
  } catch (error) {
    console.error("Error updating cluster:", error);
    return NextResponse.json({ error: "Failed to update cluster" }, { status: 500 });
  }
}

  export async function DELETE(req) {
    try {
      await connectMongoDB();
      const { searchParams } = new URL(req.url);
      const clusterId = searchParams.get("id");
  
      if (!clusterId) {
        return NextResponse.json({ error: "Cluster ID is missing" }, { status: 400 });
      }
  
      const deletedCluster = await Cluster.findByIdAndDelete(clusterId);
      if (!deletedCluster) {
        return NextResponse.json({ error: "Cluster not found" }, { status: 404 });
      }
  
      // Update students and faculties to remove the cluster reference
      await Student.updateMany({ _id: { $in: deletedCluster.student_ids } }, { $unset: { cluster: 1 } });
      await Faculty.updateMany({ _id: { $in: deletedCluster.faculty_ids } }, { $unset: { cluster: 1 } });
  
      console.log("Cluster deleted successfully", deletedCluster);
      return NextResponse.json({ message: "Cluster deleted successfully", cluster: deletedCluster }, { status: 200 });
    } catch (error) {
      console.error("Error deleting cluster:", error);
      return NextResponse.json({ error: "Failed to delete cluster" }, { status: 500 });
    }
  }
  