import { Double } from 'mongodb';
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const facultySchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    fathername: {
        type: String,
       
      },
      lastname: {
        type: String,
       
      },
     
     gender:{
        type:String,
     },
     dob:{
        type:String,
     },
     role:{
        type:String,
     },
     department:{
        type:String,
     },

     
     gmail:{
        type: String,
     },
     mobile:{
        type: String,
     },
     
   students :[],
    
    
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
