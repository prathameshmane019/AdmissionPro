
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const studentSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    fatherName: {
        type: String,
       
      },
      lastName: {
        type: String,
       
      },
      motherName: {
        type: String,
       
      },
     Gender:{
        type:String,
     },
     dob:{
        type:String,
     },
     category:{
        type:String,
     },
     disability:{
        type:String,
     },
     hsc:{
        type: Number,
     },
     SSC:{
        type: Number,
     },
     cet:{
        type: Number,
     },
     pcm:{
      type: Number,
   },
     jee:{
        type: Number,
     },
  
     mobile: {
        type: String,
       
      },
      parentMobile: {
        type: String,
       
      },
      email: {
        type: String,
       
      },
    
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Student = mongoose.models.Student || model('Student', studentSchema);

export default Student;
