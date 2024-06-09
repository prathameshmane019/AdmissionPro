// models/Cluster.js
import mongoose from 'mongoose';

const clusterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  faculty_ids: {
    type: [String],
  }
  ,
  student_ids: {
    type: [String],
    required: true
  }
}, {
  timestamps: true,
});

const Cluster = mongoose.models.Cluster || mongoose.model('Cluster', clusterSchema);

export default Cluster;
