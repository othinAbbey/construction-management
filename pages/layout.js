// import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   )
// }

// components/Layout.js

import Navbar from './Navbar';
import Footer from './Footer';

const RootLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-4">{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;
