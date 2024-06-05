"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';

const ManageClusterPage = () => {
  const router = useRouter();
  const { clusterId } = router.query;
  const [cluster, setCluster] = useState(null);
  const [action, setAction] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (clusterId) {
      fetchCluster();
    }
  }, [clusterId]);

  const fetchCluster = async () => {
    try {
      const res = await fetch(`/api/cluster/${clusterId}`);
      const data = await res.json();
      setCluster(data);
    } catch (error) {
      console.error('Error fetching cluster:', error);
    }
  };

  const handleAction = async () => {
    try {
      const method = action.includes('Add') ? 'PUT' : 'DELETE';
      const type = action.includes('Faculty') ? 'faculty' : 'student';
      const res = await fetch(`/api/cluster/${clusterId}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          type,
        }),
      });

      const data = await res.json();
      if (!data.error) {
        fetchCluster();
        setAction('');
        setName('');
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error handling action:', error);
    }
  };

  return (
    <>
      <h1>Manage Cluster: {clusterId}</h1>
      {cluster && (
        <>
          <Select fullWidth placeholder="Select Action" onChange={(value) => setAction(value)}>
            <SelectItem key="add-faculty" value="Add Faculty">
              Add Faculty
            </SelectItem>
            <SelectItem key="remove-faculty" value="Remove Faculty">
              Remove Faculty
            </SelectItem>
            <SelectItem key="add-student" value="Add Student">
              Add Student
            </SelectItem>
            <SelectItem key="remove-student" value="Remove Student">
              Remove Student
            </SelectItem>
          </Select>
          <Input clearable fullWidth value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
          <Button auto onClick={handleAction}>
            Submit
          </Button>
        </>
      )}
    </>
  );
};

export default ManageClusterPage;