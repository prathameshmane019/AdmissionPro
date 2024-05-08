import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/connectDb";
import Cluster from "@/app/model/cluster";

export async function POST(req, res) {
  try {
    await connectMongoDB();

    const { data, title } = await req.json();

    let cluster = await Cluster.findOne({ title });
    if (!cluster) {
      cluster = new Cluster({ title, data: [] });
    }
const newCluster = cluster.data.push(...Object.values(data).flat());

    await cluster.save();
console.log(newCluster); 
    return NextResponse.json({ message: "Data clustered and saved successfully!" });
  } catch (error) {
    console.error("Error clustering data:", error);
    return NextResponse.json({ error: "Failed to cluster data" });
  }
}