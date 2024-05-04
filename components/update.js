"use client"
import React, { useState } from 'react';
import axios from 'axios';

const UpdateForm = () => {
  const [formData, setFormData] = useState({
    feedbackTitle: '',
    subjects: [{ id: '', subject: '', faculty: '' }],
    questions: [''],
    students: '',
    pwd: '',
    isActive: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith('subject')) {
      const newSubjects = [...formData.subjects];
      newSubjects[index][name] = value;
      setFormData({
        ...formData,
        subjects: newSubjects,
      });
    } else if (name.startsWith('question')) {
      const newQuestions = [...formData.questions];
      newQuestions[index] = value;
      setFormData({
        ...formData,
        questions: newQuestions,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAddSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { id: '', subject: '', faculty: '' }],
    });
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      subjects: newSubjects,
    });
  };

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, ''],
    });
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      questions: newQuestions,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/update', formData);
      setSubmitted(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-md shadow-md w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%]">
        <h2 className="text-2xl font-semibold mb-4">Update Feedback</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="feedbackTitle" className="block mb-2">Feedback Title:</label>
          <input
            type="text"
            id="feedbackTitle"
            name="feedbackTitle"
            value={formData.feedbackTitle}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter feedback title"
            required
          />
        </div>
        {formData.subjects.map((subject, index) => (
          <div className="mb-4" key={index}>
            <label htmlFor={`subject${index}`} className="block mb-2">Subject {index + 1}:</label>
            <div className="flex mb-2">
              <input
                type="text"
                id={`subject${index}`}
                name={`subject${index}`}
                value={subject.subject}
                onChange={(e) => handleChange(e, index)}
                className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 mr-2"
                placeholder="Enter subject"
              />
              <input
                type="text"
                id={`faculty${index}`}
                name={`faculty${index}`}
                value={subject.faculty}
                onChange={(e) => handleChange(e, index)}
                className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter faculty"
              />
            </div>
            <button
              type="button"
              className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
              onClick={() => handleRemoveSubject(index)}
            >
              Remove Subject
            </button>
          </div>
        ))}
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          onClick={handleAddSubject}
        >
          Add Subject
        </button>
        {formData.questions.map((question, index) => (
          <div className="mb-4" key={index}>
            <label htmlFor={`question${index}`} className="block mb-2">Question {index + 1}:</label>
            <div className="flex">
              <input
                type="text"
                id={`question${index}`}
                name={`question${index}`}
                value={question}
                onChange={(e) => handleChange(e, index)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter question"
                required
              />
              <button
                type="button"
                className="ml-2 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                onClick={() => handleRemoveQuestion(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          onClick={handleAddQuestion}
        >
          Add Question
        </button>
        <div className="mb-4">
          <label htmlFor="students" className="block mb-2">Number of Students:</label>
          <input
            type="number"
            id="students"
            name="students"
            value={formData.students}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter number of students"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="pwd" className="block mb-2">Password:</label>
          <input
            type="password"
            id="pwd"
            name="pwd"
            value={formData.pwd}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter password"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="isActive" className="block mb-2">Is Active:</label>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="mr-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Update Feedback
        </button>
        {submitted && (
          <p className="mt-4 text-green-600">Feedback updated successfully!</p>
        )}
      </form>
    </div>
  );
};

export default UpdateForm;
