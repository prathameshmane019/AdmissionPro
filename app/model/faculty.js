import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const facultySchema = new Schema(
  {
    name: {
      type: String,
    },
  
    role: {
      type: String,
    },
    department: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
    gender: {
      type: String,
    },
    students: [],
    
    cluster: {
      type: Schema.Types.ObjectId,
      ref: 'Cluster'
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Faculty = mongoose.models.Faculty || model('Faculty', facultySchema);
export default Faculty;
