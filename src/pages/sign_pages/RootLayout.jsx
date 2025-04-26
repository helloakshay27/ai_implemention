import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/Header';

export default function RootLayout() {

  // Determine if the current path includes "tiers"
  // Adjust this condition as needed

  return (
    <main className="h-100 w-100">
      <div className="main-content">
        <Outlet />
      </div>
    </main>
  );
}
