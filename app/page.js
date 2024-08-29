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
                <a>
                  <button className="b1">
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
                    <button className="custom-button">
                      <div className="svg-wrapper-1">
                        <div className="svg-wrapper">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                          >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path
                              fill="currentColor"
                              d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      <span>Start </span>
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
