// models/Cluster.js
import mongoose from 'mongoose';

const clusterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  data: [],
}, {
  timestamps: true,
});

const Cluster = mongoose.models.Cluster || mongoose.model('Cluster', clusterSchema);

export default Cluster;