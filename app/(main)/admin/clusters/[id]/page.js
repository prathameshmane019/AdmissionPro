// "use client";
// import React, { useState, useEffect } from 'react';
// import {
//   Autocomplete,
//   Spinner,
//   AutocompleteItem,
//   Button,
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableColumn,
//   Tab,
//   Tabs
// } from '@nextui-org/react';
// import * as XLSX from "xlsx";

// import axios from 'axios';
// import { toast } from 'sonner';
// import NoInternetPage from '@/app/components/NoInternetPage';
// const ManageClusterPage = ({ params }) => {
//   const [selectedStudents, setSelectedStudents] = useState(new Set([]));
//   const [selectedFaculties, setSelectedFaculties] = useState(new Set([]));
//   const [selected, setSelected] = useState("students");
//   const [cluster, setCluster] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [faculties, setFaculties] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [faculty, setFaculty] = useState([]);
//   const [debounceTimer, setDebounceTimer] = useState(null);
//   const [searchValue, setSearchValue] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [isOnline, setIsOnline] = useState(true);

//   useEffect(() => {
//     const handleOnlineStatusChange = () => {
//       setIsOnline(navigator.onLine);
//     };

//     window.addEventListener('online', handleOnlineStatusChange);
//     window.addEventListener('offline', handleOnlineStatusChange);

//     return () => {
//       window.removeEventListener('online', handleOnlineStatusChange);
//       window.removeEventListener('offline', handleOnlineStatusChange);
//     };
//   }, []);

//   useEffect(() => {
//     if (params.id) {
//       fetchCluster();
//     }
//   }, [params.id]);

//   const fetchCluster = async () => {
//     try {
//       setIsLoading(true);
//       const res = await axios.get(`/api/manage_cluster?id=${params.id}`);
//       const { cluster, students, faculties } = res.data;
//       setCluster(cluster);
//       setStudents(students);
//       setFaculties(faculties);
//     } catch (error) {
//       setError('Error fetching cluster');
//       console.error('Error fetching cluster:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAddUsers = async (type) => {
//     try {
//       const ids = type === 'student' ? [...selectedStudents] : [...selectedFaculties];
//       await axios.put(`/api/cluster?id=${params.id}`, {
//         action: 'add',
//         ids,
//         type
//       });
//       fetchCluster();
//     } catch (error) {
//       console.error(`Error adding ${type}s:`, error);
//     } finally {
//       setSelectedStudents(new Set([])); // Clear selected students
//       setSelectedFaculties(new Set([]));
//     }
//   };

//   const handleRemoveUsers = async (type) => {
//     try {
//       const ids = type === 'student' ? [...selectedStudents] : [...selectedFaculties];
//       await axios.put(`/api/cluster?id=${params.id}`, {
//         action: 'remove',
//         ids,
//         type
//       });
//       fetchCluster();
//     } catch (error) {
//       console.error(`Error removing ${type}s:`, error);
//     } finally {
//       setSelectedStudents(new Set([]));
//       setSelectedFaculties(new Set([]));
//     }
//   };

//   const handleSearchInputChange = async (value) => {
//     setSearchValue(value);
//     const debouncedSearch = async (value) => {
//       if (value.trim() === '') {
//         setSearchResults([]);
//         return;
//       }
//       try {
//         const response = await axios.get(`/api/search_${selected}?search=${value}`);
//         setSearchResults(response.data.user);
//       } catch (error) {
//         toast.error(`Error searching ${selected}`);
//         console.error(`Error searching ${selected}:`, error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     clearTimeout(debounceTimer);
//     setDebounceTimer(setTimeout(debouncedSearch, 300, value));
//   };

//   const handleSelectFaculty = (facultyId) => {
//     console.log(faculty);
//     setSelectedFaculties(prevSelectedFaculties => new Set([...prevSelectedFaculties, facultyId]));
//     const facultyToAdd = faculty.find(f => f._id === facultyId);
//     if (facultyToAdd) {
//       setFaculties(prevFaculties => [...prevFaculties, facultyToAdd]);
//     }
//   };

//   const downloadExcel = () => {
//     if(selected=="students"){
//     const worksheet = XLSX.utils.json_to_sheet(students);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
//     XLSX.writeFile(workbook, `${cluster.name}_students.xlsx`);
//     }
//     else
//     {
//       const worksheet = XLSX.utils.json_to_sheet(faculties);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Faculty");
//       XLSX.writeFile(workbook, `${cluster.name}_faculties.xlsx`);
//       }
//   };

//   const handleSelectStudent = (id) => {

//     selected === "students" ? setSelectedStudents(prevStudents => new Set([...prevStudents, id])) : setSelectedFaculties(prevStudents => new Set([...prevStudents, id]));

//     const studentToAdd = students.find(s => s._id === id);
//     console.log(studentToAdd);
//     if (studentToAdd) {
//       if (selected === "students") {
//         setStudents(prevStudents => [...prevStudents, studentToAdd]);
//       } else {
//         setFaculties(prevStudents => [...prevStudents, studentToAdd]);
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <Spinner type="points" />
//       </div>
//     );
//   }

//   if (error) {
//     return <h2 style={{ color: 'red' }}>{error}</h2>;
//   }

//   return (!isOnline ? <NoInternetPage /> :
//     <div className="flex w-full min-h-screen flex-col items-center p-5 bg-gray-50">
//       <h1 className="text-2xl font-bold mb-5">Manage Cluster</h1>
//       <Autocomplete
//         label={`Select ${selected}`}
//         variant="bordered"
//         placeholder={`Search for ${selected}`}
//         className="max-w-xs mb-5"
//         value={searchValue}
//         onInputChange={handleSearchInputChange}
//         selectedKeys={selectedStudents}
//         onSelectionChange={handleSelectStudent}
//       >
//         {Array.isArray(searchResults) && searchResults?.map((result) => (
//           <AutocompleteItem key={result._id} value={result._id} onClick={() => handleSelectFaculty(result._id)}>
//             {selected === "students" ? `${result.firstName} ${result.lastName}` : result.name}
//           </AutocompleteItem>
//         ))}
//       </Autocomplete>
//       <Button
//               color="primary"
//               size="sm"
//               variant="ghost"
//               onClick={downloadExcel}
//             >
//               Download
//             </Button>
//       <Tabs
//         aria-label="Options"
//         selectedKey={selected}
//         onSelectionChange={setSelected}
//         className='mt-3 mx-10'
//       >
//         <Tab key="students" title="Students">
//           <Table
//             className='h-[50vh] w-[50vw]'
//             aria-label="Students table"
//             selectionMode="multiple"
//             selectedKeys={selectedStudents}
//             onSelectionChange={setSelectedStudents}
//           >
//             <TableHeader>
//               <TableColumn>Name</TableColumn>
//             </TableHeader>
//             <TableBody items={students && students.map((student, index) => ({
//               id: student._id,
//               name: `${student.firstName} ${student.lastName}`
//             }))}>
//               {(item) => (
//                 <TableRow key={item.id}>
//                   {/* Ensure each row has two cells */}

//                   <TableCell>{item.name}</TableCell>
//                 </TableRow>
//               )}
//             </TableBody>

//           </Table>
//           <div className="flex gap-10 mt-4 justify-center items-center">

//             <Button
//               onClick={() => handleRemoveUsers('student')}
//               className="bg-foreground text-background"
//             >
//               Remove Selected Students
//             </Button>
//             <Button
//               onClick={() => handleAddUsers('student')}
//               className="bg-foreground text-background"
//             >
//               Add Selected Students
//             </Button>
//           </div>
//         </Tab>
//         <Tab key="faculty" title="Faculties">
//           <Table
//             className='h-[50vh] w-[50vw]'
//             aria-label="Faculties table"
//             selectionMode="multiple"
//             selectedKeys={selectedFaculties}
//             onSelectionChange={setSelectedFaculties}
//           >
//             <TableHeader>
//               <TableColumn>Sr.No:</TableColumn>
//               <TableColumn>Name</TableColumn>
//             </TableHeader>
//             <TableBody items={faculties && faculties?.map((faculty, index) => ({
//               id: faculty._id,
//               name: faculty.name
//             }))}>
//               {(item) => (
//                 <TableRow key={item.id}>
//                   <TableCell>{faculties?.findIndex(f => f._id === item.id) + 1}</TableCell>
//                   <TableCell>{item.name}</TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//           <div className="flex gap-10 mt-4 justify-center items-center">
//             <Button
//               onClick={() => handleRemoveUsers('faculty')}
//               className="bg-foreground text-background"
//             >
//               Remove Selected Faculties
//             </Button>
//             <Button
//               onClick={() => handleAddUsers('faculty')}
//               className="bg-foreground text-background"
//             >
//               Add Selected Faculties
//             </Button>

//           </div>
//         </Tab>
//       </Tabs>
//     </div>
//   );
// };

// export default ManageClusterPage;
"use client";
import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  Spinner,
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
  ListboxItem,
  Listbox,
} from '@nextui-org/react';
import * as XLSX from "xlsx";

import axios from 'axios';
import { toast } from 'sonner';
import NoInternetPage from '@/app/components/NoInternetPage';
import { DeleteIcon } from '@/public/DeleteIcon';

const ManageClusterPage = ({ params }) => {
  const [selectedStudents, setSelectedStudents] = useState(new Set([]));
  const [selectedFaculties, setSelectedFaculties] = useState(new Set([]));
  const [selectedAutocompleteStudents, setSelectedAutocompleteStudents] = useState([]);
  const [selectedAutocompleteFaculties, setSelectedAutocompleteFaculties] = useState([]);
  const [selected, setSelected] = useState("students");
  const [cluster, setCluster] = useState(null);
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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
    } catch (error) {
      setError('Error fetching cluster');
      console.error('Error fetching cluster:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUsers = async (type) => {
    try {
      const ids = type === 'student' ? selectedAutocompleteStudents.map(student => student._id) : selectedAutocompleteFaculties.map(faculty => faculty._id);
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
      setSelectedFaculties(new Set([]));
      setSelectedAutocompleteStudents([]);
      setSelectedAutocompleteFaculties([]);
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
      setSelectedStudents(new Set([]));
      setSelectedFaculties(new Set([]));
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
      } catch (error) {
        toast.error(`Error searching ${selected}`);
        console.error(`Error searching ${selected}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    clearTimeout(debounceTimer);
    setDebounceTimer(setTimeout(debouncedSearch, 300, value));
  };

  const handleSelectAutocomplete = (id) => {
    if (selected === "students") {
      const studentToAdd = searchResults.find(s => s._id === id);
      if (studentToAdd && !selectedAutocompleteStudents.some(s => s._id === id)) {
        setSelectedAutocompleteStudents([...selectedAutocompleteStudents, studentToAdd]);
      }
    } else {
      const facultyToAdd = searchResults.find(f => f._id === id);
      if (facultyToAdd && !selectedAutocompleteFaculties.some(f => f._id === id)) {
        setSelectedAutocompleteFaculties([...selectedAutocompleteFaculties, facultyToAdd]);
      }
    }
  };

  const handleRemoveAutocomplete = (id, type) => {
    if (type === "student") {
      setSelectedAutocompleteStudents(selectedAutocompleteStudents.filter(student => student._id !== id));
    } else {
      setSelectedAutocompleteFaculties(selectedAutocompleteFaculties.filter(faculty => faculty._id !== id));
    }
  };

  const downloadExcel = () => {
    if (selected === "students") {
      const worksheet = XLSX.utils.json_to_sheet(students);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
      XLSX.writeFile(workbook, `${cluster.name}_students.xlsx`);
    } else {
      const worksheet = XLSX.utils.json_to_sheet(faculties);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Faculty");
      XLSX.writeFile(workbook, `${cluster.name}_faculties.xlsx`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Spinner type="points" />
      </div>
    );
  }

  if (error) {
    return <h2 style={{ color: 'red' }}>{error}</h2>;
  }

  return (!isOnline ? <NoInternetPage /> :
    <div className="flex w-full min-h-screen flex-col items-center p-5 bg-gray-50">
      <h1 className="text-2xl font-bold mb-5">Manage Cluster</h1>
      <Autocomplete
        label={`Select ${selected}`}
        variant="bordered"
        placeholder={`Search for ${selected}`}
        className="max-w-xs mb-5"
        value={searchValue}
        onInputChange={handleSearchInputChange}
        selectedKeys={selected === "students" ? selectedStudents : selectedFaculties}
        onSelectionChange={handleSelectAutocomplete}
      >
        {Array.isArray(searchResults) && searchResults?.map((result) => (
          <AutocompleteItem key={result._id} value={result._id} onClick={() => handleSelectAutocomplete(result._id)}>
            {selected === "students" ? `${result.firstName} ${result.lastName}` : result.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Button
        color="primary"
        size="sm"
        variant="ghost"
        onClick={downloadExcel}
      >
        Download
      </Button>
      <Tabs
        aria-label="Options"
        selectedKey={selected}
        onSelectionChange={setSelected}
        className='mt-3 mx-10'
      >
        <Tab key="students" title="Students">
          <div className="w-full">
            <h2 className="text-lg font-semibold mb-2">Selected Students</h2>
            <Listbox
              aria-label="Selected Students"
              variant="flat"
              className="p-0 mx-auto my-4 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[100%] overflow-visible shadow-small rounded-medium"
     
            >
              {selectedAutocompleteStudents && selectedAutocompleteStudents?.map(student => (
                <ListboxItem key={student._id}
                  endContent={<DeleteIcon onClick={() => handleRemoveAutocomplete(student._id, 'student')} />}>  {`${student.firstName} ${student.lastName}`}
                </ListboxItem>
              ))}
            </Listbox>
          </div>
          <Table
            className='h-[50vh] w-[50vw]'
            aria-label="Students table"
            selectionMode="multiple"
            selectedKeys={selectedStudents}
            onSelectionChange={setSelectedStudents}
          >
            <TableHeader>
              <TableColumn>Name</TableColumn>
            </TableHeader>
            <TableBody items={students && students.map((student, index) => ({
              id: student._id,
              name: `${student.firstName} ${student.lastName}`
            }))}>
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex gap-10 mt-4 justify-center items-center">
            <Button
              onClick={() => handleRemoveUsers('student')}
              className="bg-foreground text-background"
            >
              Remove Selected Students
            </Button>
            <Button
              onClick={() => handleAddUsers('student')}
              className="bg-foreground text-background"
            >
              Add Selected Students
            </Button>
          </div>
        </Tab>
        <Tab key="faculty" title="Faculties">
          <div className="w-full">
            <h2 className="text-lg font-semibold mb-2">Selected Faculties</h2>
            <Listbox
              aria-label="Selected Faculties"
              variant="flat"
            >
              {selectedAutocompleteFaculties?.map(faculty => (
                <ListboxItem key={faculty._id}
                  endContent={<DeleteIcon onClick={() => handleRemoveAutocomplete(faculty._id, 'faculty')} />}> {faculty.name}
                </ListboxItem>
              ))}
            </Listbox>
          </div>
          <Table
            className='h-[50vh] w-[50vw]'
            aria-label="Faculties table"
            selectionMode="multiple"
            selectedKeys={selectedFaculties}
            onSelectionChange={setSelectedFaculties}
          >
            <TableHeader>
              <TableColumn>Sr.No:</TableColumn>
              <TableColumn>Name</TableColumn>
            </TableHeader>
            <TableBody items={faculties && faculties?.map((faculty, index) => ({
              id: faculty._id,
              name: faculty.name
            }))}>
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>{faculties?.findIndex(f => f._id === item.id) + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex gap-10 mt-4 justify-center items-center">
            <Button
              onClick={() => handleRemoveUsers('faculty')}
              className="bg-foreground text-background"
            >
              Remove Selected Faculties
            </Button>
            <Button
              onClick={() => handleAddUsers('faculty')}
              className="bg-foreground text-background"
            >
              Add Selected Faculties
            </Button>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default ManageClusterPage;
