import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {

  return (
    <>
      <Head>
        <title>Savitribai Phule Shikshan Prasarak Mandal's SKN Sinhgad College of Engineering, Pandharpur - Student Assure</title>
        <meta name="description" content="Student Assure - Feedback for College Students" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <div className="bg-gray-100 min-h-screen">
          <header className="bg-white shadow-md">
            <div className="container mx-auto flex justify-between items-center px-4 py-6">
              <div className='flex item-center gap-5'>
                <img src="/logoschool.jpeg" alt="Student Assure Logo" className="h-12" />
                <div>
                  <h1 className="text-lg font-bold text-gray-800">Savitribai Phule Shikshan Prasarak Mandal's<br/>SKN Sinhgad College of Engineering, Pandharpur</h1>
                  <p> At Post : Korti, Tal : Pandharpur, Dist : Solapur, Maharashtra 413304</p>
                </div>
              </div>
              <nav className="space-x-4">
                <Link href="#" className="text-gray-600 hover:text-blue-500">Home</Link>
                <Link href="/givefeedback/" className="text-gray-600 hover:text-blue-500">Contact</Link>
                <Link href="/login" className="text-gray-600 hover:text-blue-500">Login</Link>
              </nav>
            </div>
          </header>

          <main className="container mx-auto p-6">
            <section className="text-center my-12">
              <h1 className="text-5xl font-bold text-blue-500 mb-4"> Admission Management System for Engineering College</h1>
              <p className="text-gray-600 text-lg mb-8">Do the Admission processes with Admission Pro.</p>
              <Link href="/login" ><button  className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 shadow-lg">Let&#39;s Start </button></Link>
            </section>

            <section className="text-center my-12">
              <h2 className="text-3xl font-bold text-blue-500 mb-4">Welcome to Admission Pro</h2>
              <p className="text-gray-600 text-lg mx-auto max-w-xl">
              Efficiently process student applications,analyze data based on subjects,interests,and qualifications and automate the assignment of applicants to faculty members for admission related process.          </p>
            </section>
          </main>

          <footer className="bg-white py-6 mt-12">
            <div className="container mx-auto flex justify-between items-center px-4">
              <p className="text-gray-600">&copy; 2024 Admission Pro</p>
            </div>
          </footer>
        </div>
    </>
  );
}
