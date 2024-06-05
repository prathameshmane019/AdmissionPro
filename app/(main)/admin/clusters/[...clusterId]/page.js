"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ClusterPage = ({ params }) => {
  const router = useRouter();
  const { clusterId } = router.query;
  console.log(params);
  const [cluster, setCluster] = useState(null);

  useEffect(() => {
    if (clusterId) {
      fetchCluster();
    }
  }, [clusterId]);

  const fetchCluster = async () => {
    try {
      const res = await fetch(`/api/cluster/${clusterId}`);
      const data = await res.json();
      setCluster(data);
    } catch (error) {
      console.error('Error fetching cluster:', error);
    }
  };

  return (
    <>
      <h1>Cluster: {clusterId}</h1>
      {cluster && (
        <>
          <h2>Student Names</h2>
          <ul>
            {cluster.student_names.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>

          <h2>Faculty Names</h2>
          <ul>
            {cluster.faculty_names.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default ClusterPage;