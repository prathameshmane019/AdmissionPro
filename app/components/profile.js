"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Card, CardBody, CardHeader, Spinner } from '@nextui-org/react';

const Profile = () => {  
  const { data: session } = useSession();
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    const fetchFacultyData = async () => {
      if (session?.user) {
        const { id } = session.user;
        try {
          const res = await axios.get(`/api/faculty?id=${id}`);
          setFaculty(res.data);
        } catch (error) {
          console.error("Error fetching faculty data:", error);
        }
      }
    };
    fetchFacultyData();
  }, [session]);

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Spinner type="points" />
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Spinner type="points" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-lg bg-white">
        <CardHeader className="border-b border-gray-200 pb-4 mb-4">
          <h4 className="text-2xl font-semibold text-gray-800">
            Faculty Profile
          </h4>
        </CardHeader>
        <CardBody className="space-y-4">
          <h6 className="text-lg font-medium text-gray-700">FirstName: {faculty.name}</h6>
          <p className="text-gray-600">Email: {faculty.email}</p>
          <p className="text-gray-600">Role: {faculty.role}</p>
          <p className="text-gray-600">Mobile: {faculty.mobile}</p>
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;
