"use client"
// import React, { useState } from "react";
// import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
// import axios from 'axios';

// export default function AddStudentToCluster() {
//   const [searchValue, setSearchValue] = useState("");
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [searchResults, setSearchResults] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedStudents, setSelectedStudents] = useState([]);

//   // Debounce function to delay the search request
//   const debounce = (fn, delay) => {
//     let timerId;
//     return function (...args) {
//       if (timerId) clearTimeout(timerId);
//       timerId = setTimeout(() => {
//         fn.apply(this, args);
//       }, delay);
//     };
//   };

//   // Handle search with debounce
//   const handleSearchDebounced = debounce(async (value) => {
//     if (value.trim() === '') {
//       setSearchResults([]);
//       return;
//     }

//     setSearchValue(value);
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`/api/search_students?search=${value}`);
//       setSearchResults(response.data.students);
//     } catch (error) {
//       setError('Error searching students');
//       console.error('Error searching students:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, 300); // Adjust the delay as needed

//   // Handle search input change
//   const handleSearchInputChange = (value) => {
//     // Call the debounced search function
//     handleSearchDebounced(value);
//   };

//   // Handle selection change
//   const handleSelectionChange = (value) => {
//     setSelectedStudent(value);
//     setSelectedStudents([...selectedStudents, value]);
//     setSearchValue("") 
//     handleSearchDebounced("");
//   };

//   return (
//     <div className="flex w-full max-w-xs flex-col gap-2">
//       <Autocomplete
//         label="Select Student"
//         variant="bordered"
//         placeholder="Search for a student"
//         className="max-w-xs"
//         value={searchValue}

//         onInputChange={handleSearchInputChange}
//         selectedKey={selectedStudent}
//         onSelectionChange={handleSelectionChange}
//       >
//         {Array.isArray(searchResults) && searchResults.map((student) => (
//           <AutocompleteItem key={student._id} value={student._id}>
//             {`${student.firstName} ${student.lastName}`}
//           </AutocompleteItem>
//         ))}
//       </Autocomplete>
//       {selectedStudents.length > 0 && (
//         <div>
//           <p className="text-default-500 text-small">Selected Students:</p>
//           <ul>
//             {selectedStudents.map((studentId) => (
//               <li key={studentId}>{studentId}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
  Tab,
  Tabs,
  Select,
  SelectItem,
} from '@nextui-org/react';
import axios from 'axios';

const ManageClusterPage = ({ params }) => {
  const [selectedUsers, setSelectedUsers] = useState({ students: new Set([]), faculties: new Set([]) });
  const [selected, setSelected] = useState("students");
  const [cluster, setCluster] = useState(null);
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allFaculties, setAllFaculties] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchCluster();
    }
  }, [params.id]);

  const fetchCluster = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/manage_cluster?id=${params.id}`);
      const { cluster, students, faculties } = res.data;
      setCluster(cluster);
      setStudents(students);
      setFaculties(faculties);

      // const facultyRes = await axios.get('/api/faculty');
      // setAllFaculties(facultyRes.data);
    } catch (error) {
      setError('Error fetching cluster');
      console.error('Error fetching cluster:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUsers = async (type) => {
    try {
      const ids = [...selectedUsers[type]];
      await axios.put(`/api/cluster?id=${params.id}`, {
        action: 'add',
        ids,
        type
      });
      fetchCluster();
    } catch (error) {
      console.error(`Error adding ${type}s:`, error);
    }
  };

  const handleRemoveUsers = async (type) => {
    try {
      const ids = [...selectedUsers[type]];
      await axios.put(`/api/cluster?id=${params.id}`, {
        action: 'remove',
        ids,
        type
      });
      fetchCluster();
    } catch (error) {
      console.error(`Error removing ${type}s:`, error);
    }
  };

  const handleSearchInputChange = async (value) => {
    setSearchValue(value);
    const debouncedSearch = async (value) => {
      if (value.trim() === '') {
        setSearchResults([]);
        return;
      }

      // setIsLoading(true);
      try {
        const response = await axios.get(`/api/search_${selected}?search=${value}`);
        setSearchResults(response.data.students);
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

  const handleSelectionChange = (value) => {
    setSelectedUsers((prevSelectedUsers) => ({
      ...prevSelectedUsers,
      [selected]: new Set([...prevSelectedUsers[selected], value])
    }));
    setSearchValue("");
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2 style={{ color: 'red' }}>{error}</h2>;
  }

  return (
    <div className="flex w-full flex-col mx-auto items-center">
      <Tabs
        aria-label="Options"
        selectedKey={selected}
        onSelectionChange={setSelected}
        className='mt-3 mx-10'
      >
        <Tab key="students" title="Students">
          <Autocomplete
            label="Select Student"
            variant="bordered"
            placeholder="Search for a student"
            className="max-w-xs"
            value={searchValue}
            onInputChange={handleSearchInputChange}
            selectedKeys={selectedUsers.students}
            onSelectionChange={handleSelectionChange}
          >
            {Array.isArray(searchResults) && searchResults.map((student) => (
              <AutocompleteItem key={student._id} value={student._id}>
                {`${student.firstName} ${student.lastName}`}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Table
            aria-label="Controlled table example with dynamic content"
            selectionMode="multiple"
            selectedKeys={selectedUsers.students}
            onSelectionChange={(keys) => setSelectedUsers((prevSelectedUsers) => ({ ...prevSelectedUsers, students: new Set(keys) }))}
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
          <Button onClick={() => handleAddUsers('students')}>Add Selected Students</Button>
          <Button onClick={() => handleRemoveUsers('students')}>Remove Selected Students</Button>
        </Tab>
        <Tab key="faculty" title="Faculties">
          <Autocomplete
            label="Select Faculty"
            variant="bordered"
            placeholder="Search for a faculty"
            className="max-w-xs"
            value={searchValue}
            onInputChange={handleSearchInputChange}
            selectedKeys={selectedUsers.faculties}
            onSelectionChange={handleSelectionChange}
          >
            {Array.isArray(searchResults) && searchResults.map((faculty) => (
              <AutocompleteItem key={faculty._id} value={faculty._id}>
                {faculty.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Table
            aria-label="Controlled table example with dynamic content"
            selectionMode="multiple"
            selectedKeys={selectedUsers.faculties}
            onSelectionChange={(keys) => setSelectedUsers((prevSelectedUsers) => ({ ...prevSelectedUsers, faculties: new Set(keys) }))}
          >
            <TableHeader>
              <TableColumn>Sr
                .No:</TableColumn>
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
          <Button onClick={() => handleAddUsers('faculties')}>Add Selected Faculties</Button>
          <Button onClick={() => handleRemoveUsers('faculties')}>Remove Selected Faculties</Button>
          
        </Tab>
      </Tabs><Button onClick={() => console.log('Save Changes button clicked')} className='mt-5'>Save Changes</Button>
    </div>);
};

export default ManageClusterPage;
