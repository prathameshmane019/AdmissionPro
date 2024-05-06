
import Upload from '@/app/model/upload';
import { connectMongoDB } from '@/app/lib/connectDb';
import { NextResponse } from 'next/server';
export  async function POST(req, res) {
    try {
await connectMongoDB()
      const  {jsonData}  = await req.json();
      // console.log(jsonData);
      const result = await Upload.insertMany(jsonData);
      console.log(result);
      return NextResponse.json({ message: 'Data saved to MongoDB' });
    } catch (error) {
      console.error('Error saving data to MongoDB:', error);
      return NextResponse.json({ message: 'Error saving data to MongoDB' });
    }
  } 

