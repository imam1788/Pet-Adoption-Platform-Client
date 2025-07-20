import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';
import React from 'react';
import { Outlet } from 'react-router';

const MainLayout = () => {
  return (
    <div>
      <Navbar></Navbar>
      <main className="min-h-screen px-4 py-6">
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default MainLayout;