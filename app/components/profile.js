"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Card, CardBody, CardHeader, Spinner, Button, Input } from '@nextui-org/react';

const Profile = () => {  
  const { data: session } = useSession();
  const [faculty, setFaculty] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedFaculty, setUpdatedFaculty] = useState({
    name: '',
    email: '',
    role: '',
    mobile: ''
  });

  useEffect(() => {
    const fetchFacultyData = async () => {
      if (session?.user) {
        const { id } = session.user;
        try {
          const res = await axios.get(`/api/faculty?id=${id}`);
          setFaculty(res.data);
          setUpdatedFaculty(res.data);
        } catch (error) {
          console.error("Error fetching faculty data:", error);
        }
      }
    };
    fetchFacultyData();
  }, [session]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFaculty({
      ...updatedFaculty,
      [name]: value,
    });
  };

  const handleSave = async () => {
    if (session?.user) {
      const { id } = session.user;
      try {
        await axios.put(`/api/faculty?id=${id}`, updatedFaculty);
        setFaculty(updatedFaculty);
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating faculty data:", error);
      }
    }
  };

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
        <CardHeader className="border-b border-gray-200 pb-4 mb-4 flex justify-between items-center">
          <h4 className="text-2xl font-semibold text-gray-800">
            Faculty Profile
          </h4>
          <Button auto size="sm"  variant='ghost' color='primary'  onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </CardHeader>
        <CardBody className="space-y-4">
          {isEditing ? (
            <>
              <Input 
                fullWidth 
                label="FirstName" 
          
          
                name="name" 
                value={updatedFaculty.name} 
                onChange={handleInputChange} 
              />
              <Input 
                fullWidth 
                label="Email" 
                name="email" 
                value={updatedFaculty.email} 
                onChange={handleInputChange} 
              />
              <Input 
                fullWidth 
                label="Role" 
                name="role" 
                value={updatedFaculty.role} 
                onChange={handleInputChange} 
              />
              <Input 
                fullWidth 
                label="Mobile" 
                name="mobile" 
                value={updatedFaculty.mobile} 
                onChange={handleInputChange} 
              />
              <Button auto size='sm' onClick={handleSave} variant='ghost'  color="primary">
                Save
              </Button>
            </>
          ) : (
            <>
              <h6 className="text-lg font-medium text-gray-700">Name: {faculty.name}</h6>
              <p className="text-gray-600">Email: {faculty.email}</p>
              <p className="text-gray-600">Role: {faculty.role}</p>
              <p className="text-gray-600">Mobile: {faculty.mobile}</p>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;
