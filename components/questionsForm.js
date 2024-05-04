"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {toast} from 'sonner'
import axios from 'axios';

const QuestionForm = () => {
  const [feedbackType, setFeedbackType] = useState('');
  const [subType, setSubType] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState([]);

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion('');
    }
  };
  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { feedbackType, subType, questions };
    try {
      const response = await axios.post("/api/questions", data);
      console.log(response.data);
      // toast.success('Question added successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal" className={"h-screen"}>
  <ResizablePanel className='h-screen flex items-center'><Card className="w-[80%] mx-auto justify-center">
      <CardHeader>
        <CardTitle>Add Quetions</CardTitle>
        <CardDescription>Please generate quetions for feedback</CardDescription>
      </CardHeader>
      <CardContent>
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <Select defaultValue={feedbackType} onValueChange={(value) => setFeedbackType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Feedback type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="academic">Academic</SelectItem>
            <SelectItem value="event">External</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {feedbackType === 'academic' && (
        <div className="mb-4">
          <Select defaultValue={subType} onValueChange={(value) => setSubType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a sub type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="theory">Theory</SelectItem>
              <SelectItem value="practical">Practical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="flex mb-4">
        <Textarea
          placeholder="Add Question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="flex-1 mr-2"
        />
        <Button type="button" onClick={addQuestion}>
          Add
        </Button>
      </div>
      
      
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button type="submit">Save</Button>
      </CardFooter>
    </form>
    </CardContent>      
    </Card></ResizablePanel>
  <ResizableHandle />
  <ResizablePanel><div className="flex flex-col mx-5">
  {questions.map((question, index) => (
            <div key={index} className="mb-4 flex items-center">
              <Textarea
                value={question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                className="flex-1 mr-2"
              />
              <Button type="button" variant="destructive" onClick={() => removeQuestion(index)} className="ml-2">
                Remove
              </Button>
            </div>
          ))}
      </div></ResizablePanel>
</ResizablePanelGroup>
    
  );
};

export default QuestionForm;