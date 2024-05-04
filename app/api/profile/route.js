// pages/api/profile.js

import Profile from '@/models/profile';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const profiles = await Profile.find();
      res.status(200).json(profiles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profiles' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
