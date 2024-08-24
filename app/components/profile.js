"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Spinner, Button, Input, Avatar } from '@nextui-org/react';
import Image from 'next/image';
import axios from 'axios';
import { useSession } from 'next-auth/react';

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
    <div className="flex justify-center h-full items-center mt-auto bg-gradient-to-r from-blue-50 to-blue-100">
      <Card className="w-full h-full shadow-lg rounded-lg bg-white">
        <CardHeader className="border-b border-gray-200 pb-4 mb-4">
          <div className="mb-4 flex content-center m-auto space-x-4">
            <Avatar
              src="/avatar.svg"
              size="xl"
              classNames={{
                base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                icon: "text-black/120",
              }}
            />
            <div className="flex items-center space-x-4">
              <h4 className="text-2xl font-semibold text-gray-800">
                Faculty Profile
              </h4>
              <Button auto size="sm" variant="ghost" color="primary" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 p-4 flex flex-row justify-normal">
          <div className="w-[50%] m-auto">
            <Image src="/profile.svg" alt="Profile Illustration" width={400} height={400} />
          </div>
          {isEditing ? (
            <div className="space-y-4 p-4 w-[50%] m-auto">
              <Input
                fullWidth
                label="Name"
                name="name"
                size="sm"
                variant="bordered"
                value={updatedFaculty.name}
                onChange={handleInputChange}
              />
              <Input
                fullWidth
                label="Email"
                name="email"
                size="sm"
                variant="bordered"
                value={updatedFaculty.email}
                onChange={handleInputChange}
              />
              <Input
                fullWidth
                label="Role"
                name="role"
                size="sm"
                variant="bordered"
                value={updatedFaculty.role}
                onChange={handleInputChange}
              />
              <Input
                fullWidth
                label="Mobile"
                name="mobile"
                size="sm"
                variant="bordered"
                value={updatedFaculty.mobile}
                onChange={handleInputChange}
              />
              <Button auto size="sm" onClick={handleSave} variant="ghost" color="primary">
                Save
              </Button>
            </div>
          ) : (
            <div className="space-y-4 p-4 w-[50%] m-auto">
              <h5 className="text-lg font-medium">Name: {faculty.name}</h5>
              <h5 className="text-lg font-medium">Role: {faculty.role}</h5>
              <p className="text-lg text-gray-600">Email: {faculty.email}</p>
              <p className="text-lg text-gray-600">Mobile: {faculty.mobile}</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;
