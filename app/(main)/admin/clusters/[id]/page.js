"use client";
import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem, Button, Table, TableHeader, Select, SelectItem, TableBody, TableRow, TableCell, TableColumn, Tab, Tabs
} from '@nextui-org/react';
import axios from 'axios';

const ManageClusterPage = ({ params }) => {
  const [selectedStudents, setSelectedStudents] = useState(new Set([]));
  const [selectedFaculties, setSelectedFaculties] = useState(new Set([]));
  const [selected, setSelected] = useState("students");
  const [cluster, setCluster] = useState(null);
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faculty, setFaculty] = useState([]);
  const [values, setValues] = useState(new Set([]));
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (params.id) {
      fetchCluster();
      fetchFaculties();
    }
  }, [params.id]);

  const fetchFaculties = async () => {
    try {
      setIsLoading(true);
      const facultyRes = await axios.get('/api/faculty');
      setFaculty(facultyRes.data);
    } catch (error) {
      setError('Error fetching faculties');
      console.error('Error fetching faculties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCluster = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/manage_cluster?id=${params.id}`);
      const { cluster, students, faculties } = res.data;
      setCluster(cluster);
      setStudents(students);
      setFaculties(faculties);
    } catch (error) {
      setError('Error fetching cluster');
      console.error('Error fetching cluster:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUsers = async (type) => {
    try {
      const ids = type === 'student' ? [...selectedStudents] : [...selectedFaculties];
      await axios.put(`/api/cluster?id=${params.id}`, {
        action: 'add',
        ids,
        type
      });
      fetchCluster();
    } catch (error) {
      console.error(`Error adding ${type}s:`, error);
    } finally {
      setSelectedStudents(new Set([])); // Clear selected students
      setSelectedFaculties(new Set([])); // Clear selected faculties
      setValues(new Set([]));
    }
  };

  const handleRemoveUsers = async (type) => {
    try {
      const ids = type === 'student' ? [...selectedStudents] : [...selectedFaculties];
      await axios.put(`/api/cluster?id=${params.id}`, {
        action: 'remove',
        ids,
        type
      });
      fetchCluster();
    } catch (error) {
      console.error(`Error removing ${type}s:`, error);
    } finally {
      setSelectedStudents(new Set([])); // Clear selected students
      setSelectedFaculties(new Set([])); // Clear selected faculties
      setValues(new Set([]))
    }
  };

  const handleSearchInputChange = async (value) => {
    setSearchValue(value);
    const debouncedSearch = async (value) => {
      if (value.trim() === '') {
        setSearchResults([]);
        return;
      }
      try {
        const response = await axios.get(`/api/search_${selected}?search=${value}`);
        setSearchResults(response.data.user);
        console.log(response.data.user);
      } catch (error) {
        setError(`Error searching ${selected}`);
        console.error(`Error searching ${selected}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    clearTimeout(debounceTimer);
    setDebounceTimer(setTimeout(debouncedSearch, 300, value));
  };

  const handleSelectFaculty = (facultyId) => {
    setSelectedFaculties(prevSelectedFaculties => new Set([...prevSelectedFaculties, facultyId]));
    const facultyToAdd = faculty.find(f => f._id === facultyId);
    if (facultyToAdd) {
      setFaculties(prevFaculties => [...prevFaculties, facultyToAdd]);
    }
  };
  const handleSelectStudent = (id) => {
    console.log(id);
    selected ==="students" ? setSelectedStudents(prevStudents => new Set([...prevStudents, id])): setSelectedFaculties(prevStudents => new Set([...prevStudents, id]));
    const studentToAdd = students.find(s => s._id === id);
    if (studentToAdd) {
      if(selected==="students"){
      setStudents(prevStudents => [...prevStudents, studentToAdd]);
    }
      else{
        setFaculties(prevStudents => [...prevStudents, studentToAdd]);
      }
    }
  };

  const handleDeselectFaculty = (facultyId) => {
    setSelectedFaculties(prevSelectedFaculties => {
      const newSelectedFaculties = new Set(prevSelectedFaculties);
      newSelectedFaculties.delete(facultyId);
      return newSelectedFaculties;
    });
    setFaculties(prevFaculties => prevFaculties.filter(f => f._id !== facultyId));
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2 style={{ color: 'red' }}>{error}</h2>;
  }

  return (
    <div className="flex w-full flex-col mx-auto items-center">
      <Autocomplete
        label="Select Student"
        variant="bordered"
        placeholder="Search for a student"
        className="max-w-xs"
        value={searchValue}
        onInputChange={handleSearchInputChange}
        selectedKeys={selectedStudents}
        onSelectionChange={handleSelectStudent}
      >
        {Array.isArray(searchResults) && searchResults.map((student) => (
          <AutocompleteItem key={student._id} value={student._id} onClick={() => handleSelectFaculty(student._id)} // Add selected faculty to main table
          >
            {selected ==="students"?(`${student.firstName} ${student.lastName}`): student.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Tabs
        aria-label="Options"
        selectedKey={selected}
        onSelectionChange={setSelected}
        className='mt-3 mx-10'
      >
        <Tab key="students" title="Students">
          <Table
            aria-label="Controlled table example with dynamic content"
            selectionMode="multiple"
            selectedKeys={selectedStudents}
            onSelectionChange={setSelectedStudents}
          >
            <TableHeader>
              <TableColumn>Sr.No:</TableColumn>
              <TableColumn>Name</TableColumn>
            </TableHeader>
            <TableBody items={students.map((student, index) => ({ id: student._id, name: `${student.firstName} ${student.middleName || ''} ${student.lastName}`.trim() }))}>
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>{students.findIndex(s => s._id === item.id) + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Button onClick={() => handleAddUsers('student')}>Add Selected Students</Button>
          <Button onClick={() => handleRemoveUsers('student')}>Remove Selected Students</Button>
        </Tab>
        <Tab key="faculty" title="Faculties">
          <Table
            aria-label="Controlled table example with dynamic content"
            selectionMode="multiple"
            selectedKeys={selectedFaculties}
            onSelectionChange={setSelectedFaculties}
          >
            <TableHeader>
              <TableColumn>Sr.No:</TableColumn>
              <TableColumn>Name</TableColumn>
            </TableHeader>
            <TableBody items={faculties.map((faculty, index) => ({ id: faculty._id, name: faculty.name }))}>
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>{faculties.findIndex(f => f._id === item.id) + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Button onClick={() => handleAddUsers('faculty')}>Add Selected Faculties</Button>
          <Button onClick={() => handleRemoveUsers('faculty')}>Remove Selected Faculties</Button>
          <Select
            items={faculty || []}
            label={`Select faculty`}
            variant="bordered"
            isMultiline={true}
            selectedKeys={values}
            selectionMode="multiple"
            placeholder={`Select a faculty`}
            labelPlacement="outside"
            classNames={{
              base: "max-w-xs",
              trigger: "min-h-12 py-2",
            }}
            onSelectionChange={(keys) => setValues(new Set(keys))}
          >
            {(user) => (
              <SelectItem
                key={user._id}
                textValue={user.name}
                onClick={() => handleSelectFaculty(user._id)} // Add selected faculty to main table
                onDeselect={() => handleDeselectFaculty(user._id)} // Remove deselected faculty from main table
              >
                <div className="flex gap-2 items-center">
                  <div className="flex flex-col">
                    <span className="text-small">{user.name}</span>
                  </div>
                </div>
              </SelectItem>
            )}
          </Select>
        </Tab>
      </Tabs>
    </div >
  );
};

export default ManageClusterPage;
