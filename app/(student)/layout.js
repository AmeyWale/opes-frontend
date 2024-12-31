import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OPES",
  description: "An Online Proctored Examination App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <Navbar/>
        {children}
      </div>
        </body>
    </html>
  );
}
