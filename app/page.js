import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Head>
        <title>Savitribai Phule Shikshan Prasarak Mandal &#39; s SKN Sinhgad College of Engineering, Pandharpur - Student Assure</title>
        <meta name="description" content="Student Assure - Feedback for College Students" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen">
        <header className="bg-white shadow-md">
          <div className="container mx-auto flex justify-between items-center px-4 py-6">
            <div className="flex items-center gap-5">
              <Image src="/logoschool.jpeg" height={100} width={100} alt="Student Assure Logo" className="h-12" />
              <div>
                <h1 className="text-lg font-bold text-gray-800">
                  Savitribai Phule Shikshan Prasarak Mandal &#39; s<br />
                  SKN Sinhgad College of Engineering, Pandharpur
                </h1>
                <p>At Post : Korti, Tal : Pandharpur, Dist : Solapur, Maharashtra 413304</p>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/login" legacyBehavior>
                <a className="text-gray-600 hover:text-blue-500">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Login
                  </button>
                </a>
              </Link>
            </nav>
          </div>
        </header>

        <main className="container mx-auto p-6">
          <section className="text-center my-12">
            <h1 className="text-5xl font-bold text-blue-500 mb-4">Welcome to Attendance System</h1>
            <p className="text-gray-600 text-lg mb-8">Efficiently track and manage student attendance with ease.</p>
            <div className="flex justify-between items-center space-x-8">
              <div className="w-1/2">
                <Image src="/home.svg" width={600} height={600} alt="Attendance System Illustration" className="w-full h-auto" />
              </div>
              <div className="w-1/2 text-left">
                <p className="text-gray-600 text-lg mb-4">
                  This Attendance System is designed to efficiently track and manage student attendance with ease.
                  It automates the attendance process, making it more convenient for teachers and students.
                </p>
                <p className="text-gray-600 text-lg mb-4">
                  Key features include automated attendance tracking, detailed attendance reports, and easy integration
                  with existing College management systems.
                </p>
                <Link href="/login" legacyBehavior>
                  <a>
                    <button className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 shadow-lg">
                      Let &apos;s Start
                    </button>
                  </a>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-white py-6 mt-12">
          <div className="container mx-auto text-center px-4">
            <p className="text-gray-600">&copy; 2024 UnityTech Solutions. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
