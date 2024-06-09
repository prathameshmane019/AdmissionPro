import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/connectDb";
import Faculty from "@/app/model/faculty";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('search');
  
  try {
    await connectMongoDB(); // Connect to your database

    // Perform a case-insensitive search for faculty by name
    const faculties = await Faculty.find(
      { name: { $regex: new RegExp(query, 'i') } }
    ).select('_id name');
    
    console.log(faculties); // Log the fetched faculties
    return NextResponse.json({ user:faculties }, { status: 200 }); // Return JSON response with the fetched faculties
  } catch (error) {
    console.error('Error searching faculties:', error);
    return NextResponse.json({ error: 'Error searching faculties' }, { status: 500 }); // Return error response
  }
}
