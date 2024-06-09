"use client";
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import { toast } from 'sonner';
import NoInternetPage from './NoInternetPage'; // Import NoInternetPage component

const StudentModal = ({ isOpen, onClose, mode, user }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    fatherName: "",
    lastName: "",
    motherName: "",
    gender: "",
    dob: "",
    category: "",
    disability: "",
    hsc: 0,
    ssc: 0,
    cet: 0,
    jee: 0,
    pcm: 0,
    group: "",
    mobile: "",
    parentMobile: "",
    email: "",
    cluster: "",
    faculty: "",
    college: "",
    address: "",
    branch: "",
    remark: "",
  });

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        firstName: user.firstName || "",
        fatherName: user.fatherName || "",
        lastName: user.lastName || "",
        motherName: user.motherName || "",
        gender: user.gender || "",
        dob: user.dob || "",
        category: user.category || "",
        disability: user.disability || "",
        hsc: user.hsc || 0,
        ssc: user.ssc || 0,
        cet: user.cet || 0,
        jee: user.jee || 0,
        pcm: user.pcm || 0,
        group: user.group || "",
        mobile: user.mobile || "",
        parentMobile: user.parentMobile || "",
        email: user.email || "",
        clusterName: user.cluster || "",
        faculty: user.faculty || "",
        collegeName: user.college || "",
        address: user.address || "",
        branch: user.branch || "",
        remark: user.remark || "",
      });
    } else {
      setFormData({
        firstName: "",
        fatherName: "",
        lastName: "",
        motherName: "",
        gender: "",
        dob: "",
        category: "",
        disability: "",
        hsc: 0,
        ssc: 0,
        cet: 0,
        jee: 0,
        pcm: 0,
        group: "",
        mobile: "",
        parentMobile: "",
        email: "",
        cluster: "",
        faculty: "",
        college: "",
        address: "",
        branch: "",
        remark: "",
      });
    }
  }, [isOpen, mode, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const cleanedFormData = {
        ...formData,
        hsc: parseInt(formData.hsc, 10),
        ssc: parseInt(formData.ssc, 10),
        cet: parseInt(formData.cet, 10),
        jee: parseInt(formData.jee, 10),
        pcm: parseInt(formData.pcm, 10),
      };

      if (mode === "add") {
        const response = await axios.post("/api/students", cleanedFormData);
        console.log("Student added:", response.data);
        toast.success('Student added successfully');
      } else if (mode === "edit") {
        const response = await axios.put(`/api/students?_id=${user._id}`, cleanedFormData);
        console.log("Student updated:", response.data);
        toast.success('Student updated successfully');
      }
      
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error('Error occurred while saving student data');
    }
  };

  if (!isOnline) {
    return <NoInternetPage />;
  }

  return (
    <Modal backdrop="opaque" isOpen={isOpen} size="4xl" onOpenChange={onClose} classNames={{ backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20" }}>
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            {mode === "view" ? "View User" : mode === "edit" ? "Edit User" : "Add New User"}
          </ModalHeader>
          <ModalBody>
            {mode === "view" && user && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p>Name: {user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <p>Father's Name: {user.fatherName}</p>
                </div>
                <div>
                  <p>Mother's Name: {user.motherName}</p>
                </div>
                <div>
                  <p>Gender: {user.gender}</p>
                </div>
                <div>
                  <p>Date of Birth: {user.dob}</p>
                </div>
                <div>
                  <p>Category: {user.category}</p>
                </div>
                <div>
                  <p>Disability: {user.disability}</p>
                </div>
                <div>
                  <p>HSC Score: {user.hsc}</p>
                </div>
                <div>
                  <p>SSC Score: {user.ssc}</p>
                </div>
                <div>
                  <p>CET Score: {user.cet}</p>
                </div>
                <div>
                  <p>JEE Score: {user.jee}</p>
                </div>
                <div>
                  <p>PCM Group: {user.pcm}</p>
                </div>
                <div>
                  <p>Group: {user.group}</p>
                </div>
                <div>
                  <p>Mobile: {user.mobile}</p>
                </div>
                <div>
                  <p>Parent's Mobile: {user.parentMobile}</p>
                </div>
                <div>
                  <p>Email: {user.email}</p>
                </div>
                <div>
                  <p>Cluster Name: {user.cluster}</p>
                </div>
                <div>
                  <p>Faculty: {user.faculty}</p>
                </div>
                <div>
                  <p>College Name: {user.college}</p>
                </div>
                <div>
                  <p>Address: {user.address}</p>
                </div>
                <div>
                  <p>Interested Branch: {user.branch}</p>
                </div>
                <div>
                  <p>Remark: {user.remark}</p>
                </div>
              </div>
            )}
            {(mode === "edit" || mode === "add") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input name="firstName"
                  size="sm"
                  variant="bordered"
                  isRequired label="First Name" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div>
                  <Input name="lastName" 
                  size="sm"
                  variant="bordered"
                  isRequired  label="Last Name" value={formData.lastName} onChange={handleChange} />
                </div>
                <div>
                  <Input name="fatherName"
                  size="sm"
                  variant="bordered"
                  label="Father's Name" value={formData.fatherName} onChange={handleChange} />
                </div>
                <div>
                  <Input name="motherName"
                  size="sm"
                  variant="bordered"
                  label="Mother's Name" value={formData.motherName} onChange={handleChange} />
                </div>
                <div>
                <Select name="gender" 
                  label="Gender" 
                  placeholder="Select gender" 
                  size="sm"
                  variant="bordered"
                  selectedKeys={[formData.gender]}
                  onChange={handleChange}
                  >
                    <SelectItem  key="M" >Male</SelectItem>
                    <SelectItem  key="F" >Female</SelectItem>
                  </Select>
                </div>
                <div>
                  <Input name="dob"
                  size="sm"
                  variant="bordered"
                  label="Date of Birth" value={formData.dob} onChange={handleChange} required />
                </div>
                <div>
                  <Input name="category"
                  size="sm"
                  variant="bordered"
                  label="Category" value={formData.category} onChange={handleChange} required />
                </div>
                <div>
                  <Input name="disability" 
                  size="sm"
                  variant="bordered"
                  label="Disability" value={formData.disability} onChange={handleChange} />
                </div>
                <div>
                  <Input name="hsc"
                  size="sm"
                  variant="bordered"
                  label="HSC Score" value={formData.hsc} onChange={handleChange} type="number" required />
                </div>
                <div>
                  <Input name="ssc"
                  size="sm"
                  variant="bordered"
                  label="SSC Score" value={formData.ssc} onChange={handleChange} type="number" required />
                </div>
                <div>
                  <Input name="cet"
                  size="sm"
                  variant="bordered"
                  label="CET Score" value={formData.cet} onChange={handleChange} type="number" />
                </div>
                <div>
                  <Input name="jee"
                  size="sm"
                  variant="bordered"
                  label="JEE Score" value={formData.jee} onChange={handleChange} type="number" />
                </div>
                <div>
                  <Input name="pcm"
                  size="sm"
                  variant="bordered"
                  label="PCM Group" value={formData.pcm} onChange={handleChange} type="number" />
                </div>
                <div>
                  <Input name="group" 
                  size="sm"
                  variant="bordered"
                  label="Group" value={formData.group} onChange={handleChange} required />
                </div>
                <div>
                  <Input name="mobile" isRequired 
                  size="sm"
                  variant="bordered"
                  label="Mobile" value={formData.mobile} onChange={handleChange} required />
                </div>
                <div>
                  <Input name="parentMobile" 
                  size="sm"
                  variant="bordered"
                  label="Parent's Mobile" value={formData.parentMobile} onChange={handleChange} />
                </div>
                <div>
                  <Input name="email"
                  size="sm"
                  variant="bordered"
                  label="Email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                  <Input name="cluster"
                  size="sm"
                  variant="bordered"
                  label="Cluster Name" value={formData.cluster} onChange={handleChange} required />
                </div>
                <div>
                  <Input name="college"
                  size="sm"
                  variant="bordered"
                  label="College Name" value={formData.college} onChange={handleChange} required />
                </div>
                <div>
                  <Input name="faculty"
                  size="sm"
                  variant="bordered"
                  label="Faculty" value={formData.faculty} onChange={handleChange} required />
                </div>
                <div>
                  <Input name="address"
                  size="sm"
                  variant="bordered"
                  label="Address" value={formData.address} onChange={handleChange} required />
                </div>
                <div>
                  <Select name="branch" label="Interested Branch" 
                  size="sm"
                  variant="bordered"
                  placeholder="Select Branch" 
                  selectedKeys={[formData.branch]} 
                  value={formData.branch}
                  onChange={handleChange}
                  >
                    <SelectItem  key="CSE">CSE</SelectItem>
                    <SelectItem key="ENTC">ENTC</SelectItem>
                    <SelectItem key="Electrical">Electrical</SelectItem>
                    <SelectItem  key="MECH">MECHANICAL</SelectItem>
                    <SelectItem  key="Civil">Civil</SelectItem>
                  </Select>
                </div>
                <div>
                  <Select name="remark" 
                  size="sm"
                  label="Remark" 
                  placeholder="Select Remark" 
                  // value={formData.remark}
                  variant="bordered"
                  selectedKeys={[formData.remark]}
                  onChange={handleChange}
                  >
                    <SelectItem  key="Interested" >Interested</SelectItem>
                    <SelectItem  key="Not Interested" >Not Interested</SelectItem>
                  </Select>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose} className="mr-2">
              Close
            </Button>
            {(mode === "edit" || mode === "add") && (
              <Button color="primary" onPress={handleSubmit}>
                Save
              </Button>
            )}
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default StudentModal;
