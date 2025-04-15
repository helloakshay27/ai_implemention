import React from 'react';


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './mor.css'
import './index.css'
import App from './App.jsx'
import ChatProvider from './contexts/chatContext.jsx'

createRoot(document.getElementById('root')).render(
  <ChatProvider>
    <App />
  </ChatProvider>
)
