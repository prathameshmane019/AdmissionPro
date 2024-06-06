import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const studentSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    fatherName: {
      type: String
    },
    lastName: {
      type: String,
      required: true
    },
    motherName: {
      type: String
    },
    gender: {
      type: String
    },
    dob: {
      type: String // Assuming dob is a string
    },
    category: {
      type: String
    },
    disability: {
      type: String
    },
    hsc: {
      type: Number
    },
    ssc: {
      type: Number
    },
    cet: {
      type: Number
    },
    jee: {
      type: Number
    },
    pcm: {
      type: Number
    },
    group: {
      type: String
    },
    mobile: {
      type: String,
      required: true
    },
    parentMobile: {
      type: String
    },
    email: {
      type: String
    },
    cluster: {
      type: String
    },
    college: {
      type: String
    },
    faculty: {
      type: String
    },
    address: {
      type: String
    },
    branch: {
      type: String
    },
    remark: {
      type: String
    }
  },
  {
    timestamps: true // Automatically add createdAt and updatedAt fields
  }
);

const Student = mongoose.models.Student || model('Student', studentSchema);

export default Student;