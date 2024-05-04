
import React from 'react';
import Profile from '@/components/profile'

const AdminPage = () => {
  const profile = {
    department: 'ENTC',
    classes: ['SY', 'TY', 'BE'],
    _id: 'EC12345',
    password: '1234',
    createdAt: '2024-04-20T15:30:29.022Z',
    updatedAt: '2024-04-20T15:30:29.022Z',
  };

  return (
    <div className="admin-page">
      <h1>Admin Page</h1>
      <Profile  profile={profile} />
    </div>
  );
};

export default AdminPage;

