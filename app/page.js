import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Head>
        <title>Savitribai Phule Shikshan Prasarak Mandal &#39; s SKN Sinhgad College of Engineering, Pandharpur - Admission Pro</title>
        <meta name="description" content="Admission Pro - Streamline Your College Admission Process" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen">
        <header className="bg-white shadow-md">
          <div className="container mx-auto flex justify-between items-center px-4 py-6">
            <div className="flex items-center gap-5">
              <Image src="/logoschool.jpeg" height={100} width={100} alt="Admission Pro Logo" className="h-12" />
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
            <h1 className="text-5xl font-bold text-blue-500 mb-4">Welcome to Admission Pro</h1>
            <p className="text-gray-600 text-lg mb-8">Streamline your college admission process with efficiency and collaboration.</p>
            <div className="flex justify-between items-center space-x-8">
              <div className="w-1/2">
                <Image src="/home.svg" width={600} height={600} alt="Admission Pro Illustration" className="w-full h-auto" />
              </div>
              <div className="w-1/2 text-left">
                <p className="text-gray-600 text-lg mb-4">
                  Admission Pro is designed specifically for engineering colleges to make the admission process more efficient.
                  By reducing the reliance on Excel, it allows for a more collaborative and streamlined approach to managing admissions.
                </p>
                <p className="text-gray-600 text-lg mb-4">
                  Key features include automated application processing, real-time status tracking, and seamless integration
                  with existing college management systems, ensuring a hassle-free admission experience.
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
