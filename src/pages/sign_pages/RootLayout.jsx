import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/Header';

export default function RootLayout() {
  const location = useLocation();

  // Determine if the current path includes "tiers"
  const noTier = location.pathname.includes('/tiers'); // Adjust this condition as needed

  return (
    <main className="h-100 w-100">
      <Header noTier={noTier} /> {/* Pass noTier based on the current path */}

      <div className="main-content">
   
      <Outlet />
        
      </div>
    </main>
  );
}
  