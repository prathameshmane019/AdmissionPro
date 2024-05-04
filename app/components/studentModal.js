import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const StudentModal = ({
  isOpen,
  onClose,
  mode,
  user,
  onSubmit,
}) => {
  return (
    <Modal
      backdrop="opaque"
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {mode === "view" ? "View User" : mode === "edit" ? "Edit User" : "Add New User"}
            </ModalHeader>
            <ModalBody>
              {/* Render user details or form fields based on the mode */}
              {mode === "view" && (
                <div>
                  <p>Name: {user.name}</p>
                  <p>Email: {user.email}</p>
                  <p>Role: {user.role}</p>
                  <p>Status: {user.status}</p>
                  {/* Add more user details as needed */}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              {(mode === "edit" || mode === "add") && (
                <Button color="primary" onPress={onSubmit}>
                  Save
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default StudentModal;