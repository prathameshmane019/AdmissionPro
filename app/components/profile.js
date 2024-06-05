'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const Profile = () => {  
  const { data: session } = useSession();
    // Check if profile is defined before destructuring
    const profile = session?.user
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