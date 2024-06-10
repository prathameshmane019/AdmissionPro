"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Card, CardBody } from '@nextui-org/react';
import { UserCircleIcon, UsersIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function Dashboard() {
  // const [data, setData] = useState({
  //   clusters: 'Loading',
  //   facultyCount: 'Loading',
  //   studentCount: 'Loading',
  //   branchStats: {}
  // });

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

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/dashboard');
      setData(response.data);

      const interestedCount = response.data.branchStats['Interested'] || 0;
      const notInterestedCount = response.data.branchStats['Not Interested'] || 0;

      setChartData({
        series: [{
          name: "Interested",
          data: [interestedCount]
        }, {
          name: "Not Interested",
          data: [notInterestedCount]
        }],
        options: {
          ...chartData.options,
          xaxis: {
            categories: ['Interested', 'Not Interested'],
          }
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error fetching dashboard data');
    }
  };

  return (
    <div className="container ml-4">
      <h1 className="text-3xl text-center my-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card onClick={() => router.push("/cluster")} shadow="md" className="max-w-[350px] rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 transition duration-300 ease-in-out">
          <CardBody className="text-center">
            <UserCircleIcon className="w-16 h-16 text-white mx-auto mb-4" />
            <h5 className="mb-2 text-white">Total Clusters</h5>
            <h2 className="text-3xl font-bold text-white">{data.clusters}</h2>
          </CardBody>
        </Card>

        <Card onClick={() => router.push("/faculty")} shadow="md" className="max-w-[350px] rounded-lg overflow-hidden bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transform hover:scale-105 transition duration-300 ease-in-out">
          <CardBody className="text-center">
            <UsersIcon className="w-16 h-16 text-white mx-auto mb-4" />
            <h5 className="mb-2 text-white">Total Faculty</h5>
            <h2 className="text-3xl font-bold text-white">{data.facultyCount}</h2>
          </CardBody>
        </Card>

        <Card onClick={() => router.push("/students")} shadow="md" className="max-w-[350px] rounded-lg overflow-hidden bg-gradient-to-br from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 transform hover:scale-105 transition duration-300 ease-in-out">
          <CardBody className="text-center">
            <UserGroupIcon className="w-16 h-16 text-white mx-auto mb-4" />
            <h5 className="mb-2 text-white">Total Students</h5>
            <h2 className="text-3xl font-bold text-white">{data.studentCount}</h2>
          </CardBody>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl text-center mb-4">Interested Branch Statistics</h2>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
}

export default Dashboard;
