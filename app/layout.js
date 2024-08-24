import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Providers";
 // Import the ClientWrapper component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admission Pro",
  description: "SKN Sinhagad College Of Engineering Korti,Pandharpur",
  icons:{
    icon:"/logoschool.jpeg"
  }

};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
