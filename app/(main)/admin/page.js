"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardBody } from '@nextui-org/react';
import { UserCircleIcon, UsersIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { toast } from 'sonner';

function Dashboard() {
  const [clusterCount, setClusterCount] = useState("Loading");
  const [facultyCount, setFacultyCount] = useState("Loading");
  const [studentsCount, setStudentCount] = useState("Loading");

  useEffect(() => {
    fetchData();
    fetchFacultyCount();
    fetchStudentCount();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/cluster');
      setClusterCount(response.data.length);
    } catch (error) {
      console.error('Error fetching cluster data:', error);
      toast.error('Error fetching cluster data');
    }
  };

  const fetchFacultyCount = async () => {
    try {
      const response = await axios.get('/api/faculty');
      setFacultyCount(response.data.length);
    } catch (error) {
      console.error('Error fetching faculty data:', error);
      toast.error('Error fetching faculty data');
    }
  };

  const fetchStudentCount = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudentCount(response.data.length);
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Error fetching student data');
    }
  };

  return (
    <div className="container ml-4">
      <h1 className="text-3xl text-center my-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card shadow="md" className="max-w-[350px] rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 transition duration-300 ease-in-out">
          <CardBody className="text-center">
            <UserCircleIcon className="w-16 h-16 text-white mx-auto mb-4" />
            <h5 className="mb-2 text-white">Total Clusters</h5>
            <h2 className="text-3xl font-bold text-white">{clusterCount}</h2>
          </CardBody>
        </Card>

        <Card shadow="md" className="max-w-[350px] rounded-lg overflow-hidden bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transform hover:scale-105 transition duration-300 ease-in-out">
          <CardBody className="text-center">
            <UsersIcon className="w-16 h-16 text-white mx-auto mb-4" />
            <h5 className="mb-2 text-white">Total Faculty</h5>
            <h2 className="text-3xl font-bold text-white">{facultyCount}</h2>
          </CardBody>
        </Card>

        <Card shadow="md" className="max-w-[350px] rounded-lg overflow-hidden bg-gradient-to-br from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 transform hover:scale-105 transition duration-300 ease-in-out">
          <CardBody className="text-center">
            <UserGroupIcon className="w-16 h-16 text-white mx-auto mb-4" />
            <h5 className="mb-2 text-white">Total Students</h5>
            <h2 className="text-3xl font-bold text-white">{studentsCount}</h2>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
