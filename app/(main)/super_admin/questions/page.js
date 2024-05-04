"use client"
import React, { useState, useEffect } from 'react';
import QuestionForm from '@/components/questionsForm';
import QuestionsList from '@/components/questionsList';
import {toast} from 'sonner'

import axios from 'axios';
const FeedbackManager = () => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(true);
  const [savedQuestions, setSavedQuestions] = useState([]);

  useEffect(() => {
    const fetchSavedQuestions = async () => {
      try {
        const data = await axios.get("/api/getquestions")
        console.log(data.data.questions);
        
        setSavedQuestions(data.data.questions);
   
      } catch (error) {
        console.error(error);
     
      }
    };

    fetchSavedQuestions();
  }, []);

  const handleAddFeedback = () => {
    setShowFeedbackForm(true);
  };
  const handleDelete = async (index) => {
    try {
      console.log(index);
      const response = await axios.get(`/api/managequestions?_id=${index}`);
      if (response.status === 200) {
        const updatedQuestions = [...savedQuestions];
        updatedQuestions.splice(index, 1);
        setSavedQuestions(updatedQuestions);
      } else {
        console.error('Failed to delete feedback item');
        toast.error('Failed to delete feedback item');
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleUpdate = async (_id,quetions) => {
    try {
      console.log(quetions,_id);
      const response = await axios.put(`/api/managequestions/update`,{_id,quetions});
      if (response.status === 200) {
        const updatedQuestions = [...savedQuestions];
        updatedQuestions.splice(index, 1);
        setSavedQuestions(updatedQuestions);
      } else {
        console.error('Quetions Update Failed');
        toast.error('Quetions Update Failed');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleShowQuestions = () => {
    setShowFeedbackForm(false);
  };

  return (
    <div className='h-screen'>
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 mr-2 bg-blue-500 text-white rounded"
          onClick={handleAddFeedback}
        >
          Add Questions
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleShowQuestions}
        >
          Show Questions
        </button>
      </div>
      {showFeedbackForm ? (
        <QuestionForm onQuestionsSaved={(newQuestions) => setSavedQuestions([...savedQuestions, ...newQuestions])} />
      ) : (
        <QuestionsList questions={savedQuestions}
        onDelete={handleDelete} onUpdate={handleUpdate} />
      )}
    </div>
  );
};

export default FeedbackManager;