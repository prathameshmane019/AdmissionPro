
import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const clusterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  student_ids: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  // Add an array of references to faculties
  faculty_ids: [{
    type: Schema.Types.ObjectId,
    ref: 'Faculty'
  }]
},
 {
  timestamps: true,
});

const Cluster = mongoose.models.Cluster || mongoose.model('Cluster', clusterSchema);

export default Cluster;
