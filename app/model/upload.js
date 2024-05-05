import { Double } from 'mongodb';
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const uploadSchema = new Schema(
  {
    SrNo: {
        type: String,
      
      },
      District: {
        
        type: String,
      
      },
      FirstName: {

      type: String,
    
    },
    FatherName: {
        type: String,
       
      },
      Surname: {
        type: String,
       
      },
     
      ParentEmailID:{

        type:String,
     },
     ParentMobileNumber:{
        type:String,
     },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Upload = mongoose.models.Upload || model('Upload', uploadSchema);

export default Upload;
