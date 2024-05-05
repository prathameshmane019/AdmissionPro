import { Double } from 'mongodb';
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const facultySchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    FName: {
        type: String,
       
      },
      LName: {
        type: String,
       
      },
     Gender:{
        type:String,
     },
     DOB:{
        type:String,
     },
     Role:{
        type:String,
     },
     Department:{
        type:String,
     },

     
     gmail:{
        type: String,
     },
     mobile:{
        type: String,
     },
    
    pwd: {
      type: String,
      
    },

  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Faculty = mongoose.models.Faculty || model('Faculty', facultySchema);

export default Faculty;
