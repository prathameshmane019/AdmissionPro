"use client"
import React, { useState,useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import axios from "axios";

const StudentModal = ({ isOpen, onClose, mode, user, onSubmit }) => {
  
  const [formData, setFormData] = useState({
    firstName: "",
    fatherName: "",
    lastName: "",
    motherName: "",
    Gender: "",
    dob: "",
    category: "",
    disability: "",
    hsc: 0,
    SSC: 0,
    cet: 0,
    jee: 0,
    pcm: 0,
    mobile: "",
    parentMobile: "",
    gmail: "",
  });

  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        firstName: user.firstName || "",
        fatherName: user.fatherName || "",
        lastName: user.lastName || "",
        motherName: user.motherName || "",
        Gender: user.Gender || "",
        dob: user.dob || "",
        category: user.category || "",
        disability: user.disability || "",
        hsc: user.hsc || 0,
        SSC: user.SSC || 0,
        cet: user.cet || 0,
        jee: user.jee || 0,
        pcm: user.pcm || 0,
        mobile: user.mobile || "",
        parentMobile: user.parentMobile || "",
        gmail: user.gmail || "",
      });
    } else {
      setFormData({
        firstName: "",
        fatherName: "",
        lastName: "",
        motherName: "",
        Gender: "",
        dob: "",
        category: "",
        disability: "",
        hsc: 0,
        SSC: 0,
        cet: 0,
        jee: 0,
        pcm: 0,
        mobile: "",
        parentMobile: "",
        gmail: "",
      });
    }
  }, [isOpen, mode, user]);

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    try {
      if (mode === "add") {
        const response = await axios.post("/api/students", formData);
        console.log("Student added:", response.data);
      } else if (mode === "edit") {
        const response = await axios.put(`/api/students?_id=${user._id}`, formData);
        console.log("Student updated:", response.data);
      }
      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };
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
                  <p>Gender: {user.Gender}</p>
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
                  <p>SSC Score: {user.SSC}</p>
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
                  <p>Mobile: {user.mobile}</p>
                </div>
                <div>
                  <p>Parent's Mobile: {user.parentMobile}</p>
                </div>
                <div>
                  <p>Email: {user.gmail}</p>
                </div>
              </div>
            )}
            {(mode === "edit" || mode === "add") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div>
                  <Input name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} />
                </div>
                <div>
                  <Input name="fatherName" label="Father's Name" value={formData.fatherName} onChange={handleChange} />
                </div>
                <div>
                  <Input name="motherName" label="Mother's Name" value={formData.motherName} onChange={handleChange} />
                </div>
                <div>
                  <Input name="Gender" label="Gender" value={formData.Gender} onChange={handleChange} required />
                </div>
                <div>
                  <Input name="dob" label="Date of Birth" value={formData.dob} onChange={handleChange} required />
                </div>
                <div>
                  <Input name="category" label="Category" value={formData.category} onChange={handleChange} required />
                </div>
                <div>
                  <Input name="disability" label="Disability" value={formData.disability} onChange={handleChange} />
                </div>
                <div>
                  <Input name="hsc" label="HSC Score" value={formData.hsc} onChange={handleChange} type="number" required />
                </div>
                <div>
                  <Input name="SSC" label="SSC Score" value={formData.SSC} onChange={handleChange} type="number" required />
                </div>
                <div>
                  <Input name="cet" label="CET Score" value={formData.cet} onChange={handleChange} type="number" />
                </div>
                <div>
                  <Input name="jee" label="JEE Score" value={formData.jee} onChange={handleChange} type="number" />
                </div>
                <div>
                  <Input name="pcm" label="PCM Group" value={formData.pcm} onChange={handleChange} type="number" />
                </div>
                <div>
                  <Input name="mobile" label="Mobile" value={formData.mobile} onChange={handleChange} required />
                </div>
                <div>
                  <Input name="parentMobile" label="Parent's Mobile" value={formData.parentMobile} onChange={handleChange} />
                </div>
                <div>
                  <Input name="gmail" label="Email" value={formData.gmail} onChange={handleChange} required />
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