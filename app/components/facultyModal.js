"use client"
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input
} from "@nextui-org/react";
import { toast } from "sonner";

export default function FacultyModal({ isOpen, onClose, mode, faculty, onSubmit }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (mode === "edit" && faculty) {
      setFormData(faculty);
    } else if (mode === "add") {
      setFormData({});
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
        <ModalHeader className="text-2xl font-semibold">
          {mode === "add" ? "Add Faculty" : "Edit Faculty"}
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              name="name"
              value={formData.name || ""}
              placeholder="Name"
              onChange={handleChange}
              className="w-full"
            />
            <Input
              type="text"
              name="gender"
              value={formData.gender || ""}
              placeholder="Gender"
              onChange={handleChange}
              className="w-full"
            />
            <Input
              type="text"
              name="department"
              value={formData.department || ""}
              placeholder="Department"
              onChange={handleChange}
              className="w-full"
            />
            <Input
              type="text"
              name="role"
              value={formData.role || ""}
              placeholder="Role"
              onChange={handleChange}
              className="w-full"
            />
            <Input
              type="email"
              name="email"
              value={formData.email || ""}
              placeholder="Email"
              onChange={handleChange}
              className="w-full"
            />
            <Input
              type="text"
              name="mobile"
              value={formData.mobile || ""}
              placeholder="Mobile"
              onChange={handleChange}
              className="w-full"
            />
            {mode === "add" && (
              <Input
                type="password"
                name="password"
                value={formData.password || ""}
                placeholder="Password"
                onChange={handleChange}
                className="w-full"
              />
            )}
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-4">
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
