"use client";
import { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableCell, TableBody, TableColumn, Button } from '@nextui-org/react';
import Link from 'next/link';

const Page = () => {
  const [clusters, setClusters] = useState([]);

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
    }
  };

  return (
    <>
      <h1>Clusters</h1>
      <Table aria-label="Clusters table">
        <TableHeader>
          <TableColumn>Cluster ID</TableColumn>
          <TableColumn>Student Names Count</TableColumn>
          <TableColumn>Faculty Names Count</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {clusters.map((cluster) => (
            <TableRow key={cluster._id}>
              <TableCell>
                <Link href={`/cluster/${cluster._id}`}>{cluster._id}</Link>
              </TableCell>
              <TableCell>{cluster.student_names.length}</TableCell>
              <TableCell>{cluster.faculty_names?.length || 0}</TableCell>
              <TableCell>
                <Link href={`/cluster/${cluster._id}/manage`}>
                  <Button>Manage</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Page;