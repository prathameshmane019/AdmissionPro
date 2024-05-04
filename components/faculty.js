"use client"
import React, { useState } from 'react';
import axios from 'axios';

const FacultyForm = () => {
  const [formData, setFormData] = useState({
    departments: [{ id: '', name: '', subject: '', faculty: '' }],
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newDepartments = [...formData.departments];
    newDepartments[index][name] = value;
    setFormData({
      ...formData,
      departments: newDepartments,
    });
  };

  const handleAddDepartment = () => {
    setFormData({
      ...formData,
      departments: [...formData.departments, { id: '', name: '', subject: '', faculty: '' }],
    });
  };

  const handleRemoveDepartment = (index) => {
    const newDepartments = formData.departments.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      departments: newDepartments,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/faculty', formData);
      setSubmitted(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-md shadow-md w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%]">
        <h2 className="text-2xl font-semibold mb-4">Add Faculty Details</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {formData.departments.map((department, index) => (
          <div className="mb-4" key={index}>
            <label htmlFor={`name${index}`} className="block mb-2">Department Name:</label>
            <input
              type="text"
              id={`name${index}`}
              name="name"
              value={department.name}
              onChange={(e) => handleChange(e, index)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter department name"
            />
            <label htmlFor={`subject${index}`} className="block mt-2 mb-2">Subject:</label>
            <input
              type="text"
              id={`subject${index}`}
              name="subject"
              value={department.subject}
              onChange={(e) => handleChange(e, index)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter subject"
            />
            <label htmlFor={`faculty${index}`} className="block mt-2 mb-2">Faculty:</label>
            <input
              type="text"
              id={`faculty${index}`}
              name="faculty"
              value={department.faculty}
              onChange={(e) => handleChange(e, index)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter faculty name"
            />
            <button
              type="button"
              className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
              onClick={() => handleRemoveDepartment(index)}
            >
              Remove Department
            </button>
          </div>
        ))}
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          onClick={handleAddDepartment}
        >
          Add Department
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Save Faculty Details
        </button>
        {submitted && (
          <p className="mt-4 text-green-600">Faculty details saved successfully!</p>
        )}
      </form>
    </div>
  );
};

export default FacultyForm;
