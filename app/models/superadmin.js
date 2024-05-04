import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const adminSchema = new Schema({
  _id: { type: String }, 
  fullname: {
    firstName: String,
    middleName: String,
    surName: String
  },
  
  email: {
    type: String,
    required: true
  },
  password:{
    type:String,
    required: true
  }
}, { timestamps: true });


const Admin = mongoose.models.Admin || model('Admin', adminSchema);

export default Admin;
