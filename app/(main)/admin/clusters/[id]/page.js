"use client";
import { useState, useEffect } from 'react';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import axios from 'axios';

const ManageClusterPage = ({ params }) => {
  const [cluster, setCluster] = useState(null);
  const [action, setAction] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
console.log(params.id);
  useEffect(() => {
    if (params.id) {
      fetchCluster();
    }
  }, [params.id]);

  const fetchCluster = async () => {
    try {
      setIsLoading(true);
      console.log(params.id);
      const res = await axios.get(`/api/cluster?id=${params.id}`);
      console.log("cluster "+ res.data);
      setCluster(res.data);
    } catch (error) {
      setError('Error fetching cluster');
      console.error('Error fetching cluster:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2 style={{ color: 'red' }}>{error}</h2>;
  }

  return (
    <>
      <h2>Manage Cluster: {params.id}</h2>
      {cluster && (
        <>
          <h3>Student Names</h3>
          <ul>
            {cluster && cluster?.student_names?.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>

          <h3>Faculty Names</h3>
          <ul >
            {cluster && cluster?.faculty_names?.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
{/* 
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
          </Button> */}
        </>
      )}
    </>
  );
};

export default ManageClusterPage;