import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const superadmin_feedbackSchema = new Schema(
  {
    feedbackTitle: {
      type: String,
      required: true,
    },
    
    class: {
      type: String,
      required: true,
      enum: ['FY', 'SY', 'TY', 'Final Year'], // Replace with your class options
    },
    
    department: {
      type: String,
      required: true,
      enum: ['CSE', 'First Year', 'ENTC', 'Electrial', 'Civil', 'Mechanical'], // Replace with your department options
    },
    
    feedbackType: {
      type: String,
      required: true,
      enum: ['Theory', 'Practical'], // Replace with your feedback type options
    },
    
    questions: [
      {
        type: String,
        required: true,
      }
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Superadmin_Feedback = mongoose.models.Superadmin_Feedback || model('Superadmin_Feedback', superadmin_feedbackSchema);

export default Superadmin_Feedback;
