"use client"
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,Input
} from "@nextui-org/react";
import { toast } from "sonner";
export default function FacultyModal({ isOpen, onClose, mode, faculty, onSubmit }) {
  const [formData, setFormData] = useState({});
 

  useEffect(() => {
    if (mode === "edit" && faculty) {
      setFormData(faculty);
    }
  }, [isOpen, mode, faculty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit data");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{mode === "add" ? "Add Faculty" : "Edit Faculty"}</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              name="name"
              value={formData.name || ""}
              placeholder="Name"
              onChange={handleChange}
            />
            <Input
              type="text"
              name="gender"
              value={formData.gender || ""}
              placeholder="Gender"
              onChange={handleChange}
            />
            <Input
              type="text"
              name="department"
              value={formData.department || ""}
              placeholder="Department"
              onChange={handleChange}
            />
            <Input
              type="text"
              name="role"
              value={formData.role || ""}
              placeholder="Role"
              onChange={handleChange}
            />
            <Input
              type="email"
              name="email"
              value={formData.email || ""}
              placeholder="Email"
              onChange={handleChange}
            />
            <Input
              type="text"
              name="mobile"
              value={formData.mobile || ""}
              placeholder="Mobile"
              onChange={handleChange}
            />
            {mode === "add" && (
              <Input
                type="password"
                name="password"
                value={formData.password || ""}
                placeholder="Password"
                onChange={handleChange}
              />
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit}>
            {mode === "add" ? "Add" : "Update"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
