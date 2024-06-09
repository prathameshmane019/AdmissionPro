"use client";
import { useState, useEffect } from 'react';
import { Button, Table, TableHeader, TableBody, TableRow, TableCell, TableColumn, Tab, Tabs } from '@nextui-org/react';
import axios from 'axios';

const ManageClusterPage = ({ params }) => {
  const [selectedStudents, setSelectedStudents] = useState(new Set([]));
  const [selectedFaculties, setSelectedFaculties] = useState(new Set([]));
  const [selected, setSelected] = useState("students");
  const [cluster, setCluster] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchCluster();
    }
  }, [params.id]);

  const fetchCluster = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/cluster?id=${params.id}`);
      setCluster(res.data);
    } catch (error) {
      setError('Error fetching cluster');
      console.error('Error fetching cluster:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUsers = async (type) => {
    try {
      const ids = type === 'student' ? [...selectedStudents] : [...selectedFaculties];
      await axios.put(`/api/cluster?id=${params.id}`, {
        action: 'add',
        ids,
        type
      });
      fetchCluster();
    } catch (error) {
      console.error(`Error adding ${type}s:`, error);
    }
  };

  const handleRemoveUsers = async (type) => {
    try {
      const ids = type === 'student' ? [...selectedStudents] : [...selectedFaculties];
      await axios.put(`/api/cluster?id=${params.id}`, {
        action: 'remove',
        ids,
        type
      });
      fetchCluster();
    } catch (error) {
      console.error(`Error removing ${type}s:`, error);
    }
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2 style={{ color: 'red' }}>{error}</h2>;
  }

  return (
    <div className="flex w-full flex-col mx-auto items-center">
      <Tabs
        aria-label="Options"
        selectedKey={selected}
        onSelectionChange={setSelected}
        className='mt-3 mx-10'
      >
        <Tab key="students" title="Students">
          <Table
            aria-label="Controlled table example with dynamic content"
            selectionMode="multiple"
            selectedKeys={selectedStudents}
            onSelectionChange={setSelectedStudents}
          >
            <TableHeader>
              <TableColumn>Sr.No:</TableColumn>
              <TableColumn>Name</TableColumn>
            </TableHeader>
            <TableBody items={cluster?.student_names?.map((name, index) => ({ id: index, name })) || []}>
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Button onClick={() => handleAddUsers('student')}>Add Selected Students</Button>
          <Button onClick={() => handleRemoveUsers('student')}>Remove Selected Students</Button>
        </Tab>
        <Tab key="faculty" title="Faculties">
          <Table
            aria-label="Controlled table example with dynamic content"
            selectionMode="multiple"
            selectedKeys={selectedFaculties}
            onSelectionChange={setSelectedFaculties}
          >
            <TableHeader>
              <TableColumn>Sr.No:</TableColumn>
              <TableColumn>Name</TableColumn>
            </TableHeader>
            <TableBody items={cluster?.faculty_names?.map((name, index) => ({ id: index, name })) || []}>
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Button onClick={() => handleAddUsers('faculty')}>Add Selected Faculties</Button>
          <Button onClick={() => handleRemoveUsers('faculty')}>Remove Selected Faculties</Button>
        </Tab>
      </Tabs>
    </div>
  );
};

export default ManageClusterPage;
