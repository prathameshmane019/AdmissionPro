'use client'
import React from 'react';
import axios from 'axios';

const Profile = ({ profile }) => {
    // Check if profile is defined before destructuring
    if (!profile) {
      return <div>Loading...</div>; // or handle the case when profile is undefined
    }
  
    const { firstName, email, _id } = profile;
  
    return (
      <div className="profile">
        <h2>{firstName}</h2>
        <p>Email: {email}</p>
        <p>ID: {_id}</p>
      </div>
    );
  };
  
export default Profile;