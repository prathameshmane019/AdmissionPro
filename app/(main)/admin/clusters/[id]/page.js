"use client";
import { useState, useEffect } from 'react';
import { Button, Input, Select, SelectItem ,Tab,Tabs,Card,CardBody,CardFooter} from '@nextui-org/react';
import axios from 'axios';

const ManageClusterPage = ({ params }) => {
  
  const [selected, setSelected] = useState("photos");
  const [cluster, setCluster] = useState(null);
  const [action, setAction] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
console.log(params.id);
  useEffect(() => {
    if (params.id) {
      fetchCluster();
    }
  }, [params.id]);

  const fetchCluster = async () => {
    try {
      setIsLoading(true);
      console.log(params.id);
      const res = await axios.get(`/api/cluster?id=${params.id}`);
      console.log("cluster "+ res.data);
      setCluster(res.data);
    } catch (error) {
      setError('Error fetching cluster');
      console.error('Error fetching cluster:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2 style={{ color: 'red' }}>{error}</h2>;
  }

  return (
    <div className="flex w-full flex-col mx-auto items-center">
      <Tabs 
        aria-label="Options"         
        selectedKey={selected}
        onSelectionChange={setSelected}
        className='mt-3'
      >
        <Tab key="students" title="Students">
          <Card>
            <CardBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </CardBody>
          </Card>  
        </Tab>
        <Tab key="faculty" title="Faculties">
          <Card>
            <CardBody>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </CardBody>
          </Card>  
        </Tab>
      </Tabs>
    </div>  
  );
};

export default ManageClusterPage;