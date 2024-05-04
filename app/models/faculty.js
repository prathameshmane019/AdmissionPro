import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const facultySchema = new Schema(
  {
    departments: [
        {
          id: {
            type: String,
          },
          name: {
            type: String,
          },
          subject: {
            type: String,
          },
          faculty: {
            type: String,
          },
        }
    ],
   
},
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Faculty = mongoose.models.Faculty || model('Faculty', facultySchema);

export default Faculty;
