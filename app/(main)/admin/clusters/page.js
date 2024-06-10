"use client";
import { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableCell, TableBody, TableColumn, Button, Spinner, Modal, useToasts, ModalFooter, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import Link from 'next/link';
import { toast } from 'sonner';
import axios from 'axios';

const Page = () => {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchClusters();
  }, []);

  const fetchClusters = async () => {
    try {
      const res = await fetch('/api/cluster');
      const data = await res.json();
      setClusters(data);
    } catch (error) {
      console.error('Error fetching clusters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await axios.delete(`/api/manage_cluster?id=${deleteId}`);
      if (res.status === 200) {
        toast.success('Cluster deleted successfully');
        fetchClusters();
      } else {
        throw new Error('Failed to delete cluster');
      }
    } catch (error) {
      console.error('Error deleting cluster:', error);
      toast.error('Failed to delete cluster');
    } finally {
      setShowModal(false);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Spinner type="points" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-4/5 my-10">
      <h1 className="my-3 text-xl font-semibold text-center text-gray-800">Clusters</h1>
      <Table aria-label="Clusters table">
        <TableHeader>
          <TableColumn className="text-base font-medium">Cluster Name</TableColumn>
          <TableColumn className="text-base font-medium">Student Names Count</TableColumn>
          <TableColumn className="text-base font-medium">Faculty Names Count</TableColumn>
          <TableColumn className="text-base font-medium">Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {clusters && clusters.map((cluster) => (
            <TableRow key={cluster._id}>
              <TableCell className="py-2 text-sm text-gray-700">{cluster.name}</TableCell>
              <TableCell className="py-2 text-sm text-gray-700">{cluster?.student_ids?.length}</TableCell>
              <TableCell className="py-2 text-sm text-gray-700">{cluster?.faculty_ids?.length || 0}</TableCell>
              <TableCell className="py-2 text-sm text-gray-700">
                <Link href={`clusters/${cluster._id}`} passHref>
                  <Button
                    color="secondary"
                    className="bg-foreground text-background"
                    size="sm"
                  >
                    Manage
                  </Button>
                </Link>
                <Button
                
                  className="text-background ml-2 bg-red-600"
                  size="sm"
                  onClick={() => handleDeleteClick(cluster._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <ModalContent>
          <ModalHeader>
            Delete Cluster
          </ModalHeader>
          <ModalBody>
            Are you sure you want to delete this cluster?
          </ModalBody>
          <ModalFooter>
            <Button key="cancel" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button 
              key="delete" 
             className='bg-red-600'
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Page;
