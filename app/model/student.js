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
    },
    parentMobile: {
      type: String
    },
    email: {
      type: String
    },
    cluster: {
      type: Schema.Types.ObjectId,
      ref: 'Cluster'
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
      type: [String]
    },
    remark: {
      type: String
    },
    status:{
      type:String,
    }
  },
  {
    timestamps: true // Automatically add createdAt and updatedAt fields
  }
);

const Student = mongoose.models.Student || model('Student', studentSchema);

export default Student;