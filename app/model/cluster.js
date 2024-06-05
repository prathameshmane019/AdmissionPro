// models/Cluster.js
import mongoose from 'mongoose';

const clusterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  student_names: {
    type: [String],
    required: true
  },
  faculty_name: {
    type: [String],
    required: true
  }
}, {
  timestamps: true,
});

const Cluster = mongoose.models.Cluster || mongoose.model('Cluster', clusterSchema);

export default Cluster;
