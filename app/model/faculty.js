import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import Cluster from './cluster';

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


facultySchema.pre('remove', async function(next) {
  const docToDelete = await this.model.findOne(this._id);
  console.log(docToDelete);
  if (docToDelete.cluster) {
    await mongoose.model('Cluster').findByIdAndUpdate(docToDelete.cluster, {
      $pull: { faculty_ids: docToDelete._id }
    });
  }
  console.log("deleted faculty");
  next();
});

facultySchema.pre('init', function(doc) {
  this._originalCluster = doc.cluster;
});


facultySchema.pre('remove', async function(next) {
  const facultyId = this._id;
  try {
      // Update all clusters that reference this faculty and remove the reference
      await Cluster.updateMany({ faculty_ids: facultyId }, { $pull: { faculty_ids: facultyId }});
      next();
  } catch (error) {
      console.error("Error updating clusters:", error);
      next(error); // Pass error to the next middleware
  }
});
const Faculty = mongoose.models.Faculty || model('Faculty', facultySchema);
export default Faculty;
