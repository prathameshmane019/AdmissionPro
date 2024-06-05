"use client";
import { useState, useEffect } from 'react';
import {
  Button, ModalHeader, ModalBody, ModalFooter, Select, SelectItem,
  Card, Spinner, Modal, Spacer, Dropdown, Chip, Avatar, Autocomplete, AutocompleteItem,
  ModalContent, DropdownItem, DropdownMenu, DropdownTrigger
} from '@nextui-org/react';
import axios from 'axios';

const ManageClusterPage = ({ params }) => {
  const [cluster, setCluster] = useState(null);
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedNames, setSelectedNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [visible, setVisible] = useState(false);
  console.log(setSelectedNames);

  useEffect(() => {
    if (params.id) {
      fetchCluster();
      fetchMembers();
    }
  }, [params.id]);

  const fetchCluster = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/cluster?id=${params.id}`);
      setCluster(res.data);
    } catch (error) {
      setError('Error fetching cluster');
      console.error('Error fetching cluster:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      // const studentRes = await axios.get('/api/student'); // Endpoint to fetch all students
      const facultyRes = await axios.get('/api/faculty'); // Endpoint to fetch all faculty
      // setStudents(studentRes.data);
      setFaculty(facultyRes.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleConfirm = () => {
    setVisible(true);
  };

  const handleAction = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const action = selectedAction.includes('add') ? 'add' : 'remove';
      const type = selectedType.includes('faculty') ? 'faculty' : 'student';

      const res = await axios.put(`/api/cluster?id=${params.id}`, {
        action,
        names: selectedNames,
        type,
      });

      if (res.data.error) {
        setError(res.data.error);
      } else {
        fetchCluster();
        setSelectedAction('');
        setSelectedType('');
        setSelectedNames([]);
        setVisible(false);
      }
    } catch (error) {
      setError('Error handling action');
      console.error('Error handling action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSelect = () => {
    const users = selectedType === 'faculty' ? faculty : students;

    return (
      <Select
        items={faculty}
        label={`Select ${selectedType}`}
        variant="bordered"
        isMultiline={true}
        selectionMode="multiple"
        placeholder={`Select a ${selectedType}`}
        labelPlacement="outside"
        classNames={{
          base: "max-w-xs",
          trigger: "min-h-12 py-2",
        }}
        onChange={(items) => {
          if (!Array.isArray(items)) return;
          setSelectedNames(items.map(item => item.data.name));
        }}
        renderValue={(items) => {
          return (
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <Chip key={item.key}>{item.data.name}</Chip>
              ))}
            </div>
          );
        }}
      >
        {(user) => (
          <SelectItem key={user._id} textValue={user.name}>
            <div className="flex gap-2 items-center">
              <div className="flex flex-col">
                <span className="text-small">{user.name}</span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>
    );
  };

  const renderAutocomplete = () => {
    const items = selectedType === 'faculty' ? cluster.faculty_names : cluster.student_names;

    return (
      <Autocomplete
        defaultItems={items.map((name, index) => ({ value: index, label: name }))}
        label={`Remove ${selectedType}`}
        placeholder={`Search a ${selectedType} to remove`}
        className="max-w-xs"
        onChange={(selected) => setSelectedNames([selected.label])}
      >
        {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
      </Autocomplete>
    );
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <h2 style={{ color: 'red' }}>{error}</h2>;
  }

  return (
    <div style={{ maxWidth: '90vw', height: '100vh', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Manage Cluster: {params.id}</h2>
      {cluster && (
        <div>
          <div className='flex'>
            <Card className='w-[40vw] h-[60vh] overflow-y-auto p-5'>
              <h3>Student Names</h3>
              <ul>
                {cluster.student_names.map((name, index) => (
                  <li key={index}>{index + 1} {name}</li>
                ))}
              </ul>
            </Card>
            <Spacer y={1} />
            <Card className='w-[40vw] h-[60vh] overflow-y-auto p-5'>
              <h3>Faculty Names</h3>
              <ul>
                {cluster.faculty_names.map((name, index) => (
                  <li key={index}>{index + 1} {name}</li>
                ))}
              </ul>
            </Card>
          </div>
          <Spacer y={1} />
          <Dropdown>
            <DropdownTrigger><Button flat>Select Action</Button></DropdownTrigger>
            <DropdownMenu onAction={(key) => setSelectedAction(key)}>
              <DropdownItem key="add-faculty">Add Faculty</DropdownItem>
              <DropdownItem key="remove-faculty">Remove Faculty</DropdownItem>
              <DropdownItem key="add-student">Add Student</DropdownItem>
              <DropdownItem key="remove-student">Remove Student</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Spacer y={1} />
          <Dropdown>
            <DropdownTrigger><Button flat>Select Type</Button></DropdownTrigger>
            <DropdownMenu onAction={(key) => setSelectedType(key)}>
              <DropdownItem key="faculty">Faculty</DropdownItem>
              <DropdownItem key="student">Student</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Spacer y={1} />
          {selectedAction && selectedType && (
            selectedAction.includes('add') ? renderSelect() : renderAutocomplete()
          )}
          <Spacer y={1} />
          <Button auto onClick={handleConfirm} disabled={!selectedAction || !selectedType || !selectedNames.length}>
            Submit
          </Button>
        </div>
      )}
      <Modal closeButton blur isOpen={visible} onClose={() => setVisible(false)}>
        <ModalContent>
          <ModalHeader>
            <h4>Confirm Action</h4>
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to {selectedAction} the following {selectedType}(s): {selectedNames.join(', ')}?</p>
          </ModalBody>
          <ModalFooter>
            <Button auto flat color="error" onClick={() => setVisible(false)}>
              Cancel
            </Button>
            <Button auto onClick={handleAction}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ManageClusterPage;
