// /app/(main)/super_admin/departments/page.js
"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import RegisterPage from '@/components/adminregister';

const Page = () => {
  // State to hold departments data
  const [departments, setDepartments] = useState([]);
  // State to control the display of the register form
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Fetch departments data from API or backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/api/managedepartment');
        setDepartments(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  // Function to toggle the display of the register form
  const toggleRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm);
  };

  return (
    <div className='h-screen overflow-y-auto container mx-auto p-4'>

      <h1 className="text-2xl font-bold mb-4">Manage Departments</h1>

      {/* Departments Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Registered Departments</h2>
      <RegisterPage />

        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Classes</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department._id}>
                <td className="border border-gray-300 px-4 py-2">{department._id}</td>
                <td className="border border-gray-300 px-4 py-2">{department.department}</td>
                <td className="border border-gray-300 px-4 py-2">{department.classes.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Department Button */}
      {/* <div className="mt-4">
        <button onClick={toggleRegisterForm} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Add Department
        </button>
      </div> */}

      
    </div>
  );
};

export default Page;
