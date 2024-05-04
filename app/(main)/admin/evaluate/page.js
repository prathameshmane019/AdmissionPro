// pages/FeedbackList.js
"use client"
import { useEffect, useState } from 'react';

const FeedbackList = () => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('/api/feedback');
        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }
        const data = await response.json();
        setFeedback(data.response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFeedback();
  }, []);

  // Function to calculate total points for a question
  const calculateTotalPoints = (ratings) => {
    return ratings.reduce((acc, rating) => acc + rating, 0);
  };

  return (
    <div>
      <h1>Feedback List</h1>
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Rating 1</th>
            <th>Rating 2</th>
            <th>Rating 3</th>
            {/* Add more rating columns as needed */}
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {feedback.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              {/* Assuming there are 3 ratings for each question */}
              <td>{item.ratings[0]}</td>
              <td>{item.ratings[1]}</td>
              <td>{item.ratings[2]}</td>
              {/* Calculate total points for each question */}
              <td>{calculateTotalPoints(item.ratings)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackList;
