import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/connectDb";
import Student from "@/app/model/student";
export async function GET(req) {  
const { searchParams } = new URL(req.url);
const query = searchParams.get('search');
try {
    await connectMongoDB() // Connect to your database

    const students = await Student.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { middleName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } }
      ]
    }).select('_id firstName middleName lastName');

    return NextResponse.json({user:students},{status:200});
  } catch (error) {
    console.error('Error searching students:', error);
    return NextResponse.json({ error: 'Error searching students' },{status:500});
  }
}