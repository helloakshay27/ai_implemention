import React from 'react';


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './mor.css'
import './index.css'
import App from './App.jsx'
import ChatProvider from './contexts/chatContext.jsx'
import { BrowserRouter } from 'react-router-dom';
import BRDTable from './components/BRDTable.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ChatProvider>
      <App />
      </ChatProvider>
  </BrowserRouter>
)
