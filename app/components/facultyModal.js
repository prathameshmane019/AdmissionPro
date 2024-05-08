import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import axios from "axios";

const FacultyModal = ({ isOpen, onClose, mode, faculty, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    fatherName: "",
    lastName: "",
    gender: "",
    dob: "",
    role: "",
    department: "",
    email: "",
    mobile: "",
    pwd: "",
  });

  useEffect(() => {
    if (mode === "edit" && faculty) {
      setFormData({
        firstName: faculty.firstName || "",
        fatherName: faculty.fatherName || "",
        lastName: faculty.lastName || "",
        gender: faculty.gender || "",
        dob: faculty.dob || "",
        role: faculty.role || "",
        department: faculty.department || "",
        email: faculty.email || "",
        mobile: faculty.mobile || "",
        pwd: faculty.pwd || "",
      });
    } else {
      setFormData({
        firstName: "",
        fatherName: "",
        lastName: "",
        gender: "",
        dob: "",
        role: "",
        department: "",
        email: "",
        mobile: "",
        pwd: "",
      });
    }
  }, [isOpen, mode, faculty]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      if (mode === "add") {
        const response = await axios.post("/api/faculty", formData);
        console.log("Faculty added:", response.data);
      } else if (mode === "edit") {
        const response = await axios.put(`/api/faculty?_id=${faculty._id}`, formData);
        console.log("Faculty updated:", response.data);
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
            {mode === "view" ? "View Faculty" : mode === "edit" ? "Edit Faculty" : "Add New Faculty"}
          </ModalHeader>
          <ModalBody>
            {mode === "view" && faculty && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p>First Name: {faculty.firstName}</p>
                </div>
                <div>
                  <p>Father&#39;s Name: {faculty.fatherName}</p>
                </div>
                <div>
                  <p>Last Name: {faculty.lastName}</p>
                </div>
                <div>
                  <p>Gender: {faculty.gender}</p>
                </div>
                <div>
                  <p>Date of Birth: {faculty.dob}</p>
                </div>
                <div>
                  <p>Role: {faculty.role}</p>
                </div>
                <div>
                  <p>Department: {faculty.department}</p>
                </div>
                <div>
                  <p>Email: {faculty.email}</p>
                </div>
                <div>
                  <p>Mobile: {faculty.mobile}</p>
                </div>
                <div>
                  <p>Password: {faculty.pwd}</p>
                </div>
              </div>
            )}
            {(mode === "edit" || mode === "add") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} required />
                <Input name="fatherName" label="Father's Name" value={formData.fatherName} onChange={handleChange} />
                <Input name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} />
                <Input name="gender" label="Gender" value={formData.gender} onChange={handleChange} required />
                <Input name="dob" label="Date of Birth" value={formData.dob} onChange={handleChange} required />
                <Input name="role" label="Role" value={formData.role} onChange={handleChange} required />
                <Input name="department" label="Department" value={formData.department} onChange={handleChange} required />
                <Input name="email" label="Email" value={formData.email} onChange={handleChange} required />
                <Input name="mobile" label="Mobile" value={formData.mobile} onChange={handleChange} required />
                <Input name="pwd" label="Password" value={formData.pwd} onChange={handleChange} required />
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

export default FacultyModal;
