// pages/api/upload.js

import formidable from 'formidable';
import fs from 'fs';
import csv from 'csv-parser';

import { MongoDBClient } from 'mongodb';
import { connectMongoDB } from '@/app/lib/connectDb';
import { NextResponse } from 'next/server';
import Upload from "@/app/model/upload";


export const __routeConfig = {
  // new configuration format
  api: {
    bodyParser: false,
  },
};


export  async function POST(req, res) {

    try {
      // Connect to MongoDB
       await connectToDatabase();
      

      const form = new formidable.IncomingForm();

      form.parse(req, async (err, fields, files) => {
        if (err) {
        return NextResponse.status(500).json({ message: 'Error parsing file' });
          
        }

        const filePath = files.file.path;

        // Process the CSV file
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', async () => {
            // Store data in MongoDB
            const collection = db.collection('csvData');
            await collection.insertMany(upload);

            // Close MongoDB connection
            client.close();

            // Send response
            return NextResponse.status(200).json({ message: 'File uploaded successfully' });
          });
      });
    } catch (error) {
      return NextResponse.status(500).json({ message: 'Server error' });
    }
  } 

