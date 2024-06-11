"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Card, CardBody } from '@nextui-org/react';
import { UserCircleIcon, UsersIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Spinner } from '@nextui-org/react';
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function Dashboard() {
  const [data, setData] = useState(null);  
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Remark'],
      },
      yaxis: {
        title: {
          text: 'Number of Students'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          }
        }
      }
    }
  });

  const [pieChartData, setPieChartData] = useState([]);

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/dashboard');
      const fetchedData = response?.data || {};
      setData(fetchedData);

      const branchStats = fetchedData?.branchStats || {};

      const filteredBranchStats = Object.keys(branchStats)
        .filter(key => key !== null)
        .reduce((obj, key) => {
          obj[key] = branchStats[key];
          return obj;
        }, {});

      const interestedCount = filteredBranchStats['Interested'] || 0;
      const notInterestedCount = filteredBranchStats['Not Interested'] || 0;

      setChartData({
        series: [{
          name: "Remark",
          data: [interestedCount, notInterestedCount]
        }],
        options: {
          ...chartData.options,
          xaxis: {
            categories: ['Interested', 'Not Interested'],
          }
        }
      });

      setPieChartData(fetchedData.pieChartData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error fetching dashboard data');
    }
  };

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Spinner type="points" />
      </div>
    );
  }

  return (
    <div className="container ml-4">
      <h1 className="text-3xl text-center my-4">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-10">
        <Card onClick={() => router.push("/cluster")} shadow="md" className="max-w-[300px] rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 transition duration-300 ease-in-out">
          <CardBody className="text-center">
            <UserCircleIcon className="w-10 h-10 text-white mx-auto mb-2" />
            <h5 className="mb-1 text-white text-sm">Total Clusters</h5>
            <h2 className="text-2xl font-bold text-white">{data.clusters || 0}</h2>
          </CardBody>
        </Card>

        <Card onClick={() => router.push("/faculty")} shadow="md" className="max-w-[300px] rounded-lg overflow-hidden bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transform hover:scale-105 transition duration-300 ease-in-out">
          <CardBody className="text-center">
            <UsersIcon className="w-10 h-10 text-white mx-auto mb-2" />
            <h5 className="mb-1 text-white text-sm">Total Faculty</h5>
            <h2 className="text-2xl font-bold text-white">{data.facultyCount || 0}</h2>
          </CardBody>
        </Card>

        <Card onClick={() => router.push("/students")} shadow="md" className="max-w-[300px] rounded-lg overflow-hidden bg-gradient-to-br from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 transform hover:scale-105 transition duration-300 ease-in-out">
          <CardBody className="text-center">
            <UserGroupIcon className="w-10 h-10 text-white mx-auto mb-2" />
            <h5 className="mb-1 text-white text-sm">Total Students</h5>
            <h2 className="text-2xl font-bold text-white">{data.studentCount || 0}</h2>
          </CardBody>
        </Card>
      </div>
      <div className="grid grid-cols-2 mx-10 gap-2 mt-10">
      <div >
        <h2 className="text-2xl text-center mb-4">Interested Branch Statistics</h2>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
          className="mx-auto mt-10"
          width={350}
        />
      </div>

      <div className='mx-auto' >
        <h2 className="text-2xl text-center ">Students from Different Clusters</h2>
        <Chart
          options={{
            labels: pieChartData.map(item => item.name),
          }}
          series={pieChartData.map(item => item.count)}
          type="pie"
          height={350}
          width={350}
          className="mx-auto mt-10"
        />
      </div>
    </div>
    </div>
  );
}

export default Dashboard;
