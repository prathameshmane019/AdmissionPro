"use client"
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const QuestionsList = ({ questions, onDelete, onUpdate }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [updatedQuestions, setUpdatedQuestions] = useState([]);

  const handleDelete = (id) => {
    onDelete(id); // Pass the ID of the question to be deleted
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setUpdatedQuestions([...questions[index].questions]); // Make a copy of questions array for editing
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestionsArray = [...updatedQuestions];
    updatedQuestionsArray[index] = value;
    setUpdatedQuestions(updatedQuestionsArray);
  };

  const handleUpdate = (index) => {
    onUpdate(questions[index]._id, updatedQuestions); // Pass the ID and updated questions
    setEditingIndex(null);
  };

  return (
    <div className="flex flex-col mx-5 mt-5 max-h-full">
      <h2 className="mb-4 font-bold">Saved Questions</h2>
      {questions.map((feedback, index) => (
        <div key={index} className="mb-8">
          <h3 className="text-lg font-semibold mb-2">
            Feedback Type: {feedback.feedbackType}
          </h3>
          {feedback.feedbackType === 'academic' && (
            <p className="mb-2">Sub Type: {feedback.subType}</p>
          )}
          <div className="flex flex-col">
            {editingIndex === index ? (
              updatedQuestions.map((question, questionIndex) => (
                <div key={questionIndex} className="mb-4 flex items-center">
                  <Textarea
                    value={question}
                    onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                    className="flex-1 mr-2"
                  />
                </div>
              ))
            ) : (
              feedback.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="mb-4 flex items-center">
                  <Textarea
                    value={`${questionIndex + 1}. ${question}`}
                    readOnly
                    className="flex-1 mr-2"
                  />
                </div>
              ))
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="destructive" onClick={() => handleDelete(feedback._id)} className="mr-2">
              Delete
            </Button>
            {editingIndex === index ? (
              <Button onClick={() => handleUpdate(index)}>Update</Button>
            ) : (
              <Button onClick={() => handleEdit(index)}>Edit</Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionsList;
