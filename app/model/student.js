import { Double } from 'mongodb';
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const studentSchema = new Schema(
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
      MName: {
        type: String,
       
      },
     Gender:{
        type:String,
     },
     DOB:{
        type:String,
     },
     Category:{
        type:String,
     },
     Disability:{
        type:String,
     },
     HSC:{
        type: Double,
     },
     SSC:{
        type: Double,
     },
     CET:{
        type: Double,
     },
     JEE:{
        type: Double,
     },
   
     mobile: {
        type: String,
       
      },
      Pmobile: {
        type: String,
       
      },
      gmail: {
        type: String,
       
      },
      Pgmail: {
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

const Student = mongoose.models.Student || model('Student', studentSchema);

export default Student;
