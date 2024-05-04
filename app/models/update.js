import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const updateSchema = new Schema(
  {
    feedbackTitle: {
      type: String,
      required: true,
    },
    subjects: [
      {
        id: {
          type: String,
        },
        subject: {
          type: String,
        },
        faculty: {
          type: String,
        },
      },
    ],
    questions: [
       {
          type: String,
          required: true,
       }
    ],
    students: {
      type: Number,
      required: true,
    },
    pwd: {
      type: String,
      required: true,
    },
    
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Update = mongoose.models.Update || model('Update', updateSchema);

export default Update;