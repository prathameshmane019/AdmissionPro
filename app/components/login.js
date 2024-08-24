"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input, Button } from '@nextui-org/react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { RiShieldUserFill } from "react-icons/ri";
import { toast } from 'sonner';
import axios from 'axios';
import Image from 'next/image';

export default function LoginComponent() {
  const [isVisible, setIsVisible] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [userIdError, setUserIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (userProfile?.role) {
      const role = userProfile.role;
      const redirectPath = role === 'superadmin' || role === 'admin' ? `/admin` : `/${role}`;
      router.replace(redirectPath);
    }
  }, [userProfile, router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (status === 'authenticated' && session?.user?.role) {
        const role = session.user.role === "admin" || session.user.role === "superadmin" ? "faculty" : session.user.role;
        const { id } = session.user;
        const storedProfile = sessionStorage.getItem('userProfile');

        if (storedProfile) {
          setUserProfile(JSON.parse(storedProfile));
        } else {
          try {
            const res = await axios.get(`/api/${role}?_id=${id}`);
            const profileData = Array.isArray(res.data) ? res.data[0] : res.data;
            profileData.role = session?.user?.role;
            sessionStorage.setItem('userProfile', JSON.stringify(profileData));
            setUserProfile(profileData);
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        }
      }
    };

    if (status === 'authenticated') {
      fetchUserProfile();
    }
  }, [session, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserIdError('');
    setPasswordError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        userId,
        password,
        redirect: false,
      });

      setIsLoading(false);

      if (result.ok) {
        toast.success('Login Successful');
      } else {
        if (result.error === 'Invalid username') {
          setUserIdError('Invalid username');
        } else if (result.error === 'Invalid password') {
          setPasswordError('Invalid password');
        } else {
          toast.error('Failed to login');
        }
      }
    } catch (error) {
      console.error('Failed to login', error);
      toast.error('Failed to login');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUserId('');
    setPassword('');
    setUserIdError('');
    setPasswordError('');
  };

  return (
    <div className="flex h-screen">
      <div className="flex flex-col w-2/3 justify-center items-center bg-violet-500 rounded-r-[20%]">
        <h3 className='text-4xl text-white'>Hey, Let&#39;s Begin </h3>
        <Image src={"/login.svg"} width={600} height={600} alt="Login Illustration" />
      </div>
      <div className="flex w-1/2 justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="w-full p-9 bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <div className="mb-4 text-left">
              <Input
                type="text"
                variant="bordered"
                label="User Id"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                isInvalid={!!userIdError}
                endContent={
                  <RiShieldUserFill className="text-2xl text-default-400 pointer-events-none"/>
                }
                className="mb-2"
                placeholder="Email Address or Phone Number"
              />
              {userIdError && <p className="text-red-500 text-sm">{userIdError}</p>}
            </div>
            <div className="mb-4 text-left">
              <Input
                label="Password"
                variant="bordered"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <IoIosEyeOff className="text-2xl text-default-400 pointer-events-none"/>
                    ) : (
                      <IoIosEye className="text-2xl text-default-400 pointer-events-none"/>
                    )}
                  </button>
                }
                type={isVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!passwordError}
                className="mb-2"
                placeholder="Password"
              />
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>
            <div className="flex justify-center space-x-4">
              <Button color="default" onClick={handleCancel} className="w-36">
                Cancel
              </Button>
              <Button color="primary" type="submit" className="w-36" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Login'}
              </Button>
            </div>
            <div className="mt-2">
              <p className="text-sm">
                <Link href="/reset_password" className="content-start text-blue-500">
                  Reset password
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
