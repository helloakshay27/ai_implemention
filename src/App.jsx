import React, { useState } from 'react';

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Layout from "./Layout";
import ChatArea from "./components/ChatArea";
import ChatInput from "./components/ChatInput";

import SignIn from "./pages/sign_pages/signIn";
import Register from "./pages/sign_pages/register";
import Forgot from "./pages/sign_pages/Forgot";
import ForgotOtp from "./pages/sign_pages/ForgotOtp";
import CreatePassword from "./pages/sign_pages/CreatePassword";
import ForgotPassword from "./pages/sign_pages/ForgotPassword";

import RootLayout from "./pages/sign_pages/RootLayout";
import ProtectedRoute from "./pages/sign_pages/ProtectedRoute";

import "./mor.css";
import { useChatContext } from './contexts/chatContext';
import PromptModal from './components/PromptModal';
import { Circle, Command } from 'lucide-react';

function App() {
  const { mode } = useChatContext();

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-otp" element={<ForgotOtp />} />
        <Route path="/reset-password/:id" element={<CreatePassword />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RootLayout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect */}
          <Route index element={<Navigate to="/ai-lockated" />} />

          {/* Main Chat Route */}
          <Route
            path="/ai-lockated"
            element={
              <Layout>
                <ChatArea />
                {
                  mode === 2 ? (
                    <div className='d-flex align-items-center justify-content-center mt-3'>
                      <button className='rounded-circle border-0 d-flex align-items-center justify-content-center position-absolute bottom-0 mb-3' style={{ height: "50px", width: "50px", backgroundColor: "#E2DED5" }} onClick={() => setIsModalOpen(true)} >
                        <Circle fill='#C72030' color='#C72030' />
                      </button>
                    </div>
                  ) : (
                    <ChatInput />
                  )
                }
              </Layout>
            }
          />
        </Route>
      </Routes>

      {
        isModalOpen && <PromptModal setIsModalOpen={setIsModalOpen} />
      }
    </BrowserRouter>
  );
}

export default App;
