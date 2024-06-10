"use client";
import { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableCell, TableBody, TableColumn, Button, Spinner } from '@nextui-org/react';
import Link from 'next/link';

const Page = () => {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
