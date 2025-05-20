import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from './api/auth/context';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notes App",
  description: "A modern notes application with markdown support",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <Toaster position="top-right" />
        <AuthProvider>
          <div className="min-h-screen">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
