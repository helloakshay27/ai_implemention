import React, { useState } from 'react';

import { Route, Routes, Navigate } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Layout from "./Layout";
import PublicLayout from "./PublicLayout";
import ChatArea from "./components/ChatArea";
import PublicChatAreaNew from "./components/PublicChatAreaNew";
import ChatInput from "./components/ChatInput";
import PublicChatInput from "./components/PublicChatInput";

import SignIn from "./pages/sign_pages/signIn";
import Register from "./pages/sign_pages/register";
import Forgot from "./pages/sign_pages/Forgot";
import ForgotOtp from "./pages/sign_pages/ForgotOtp";
import CreatePassword from "./pages/sign_pages/CreatePassword";
import ForgotPassword from "./pages/sign_pages/ForgotPassword";

import RootLayout from "./pages/sign_pages/RootLayout";
import ProtectedRoute from "./pages/sign_pages/ProtectedRoute";

import "./mor.css";
import OptionModal from './components/OptionModal';
import ChatModal from './components/ChatModal';

function App() {
  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            fontSize: "14px"
          }
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-otp" element={<ForgotOtp />} />
        <Route path="/reset-password/:id" element={<CreatePassword />} />

        {/* Public Chat Routes - No Authentication Required */}
        <Route path="/chats" element={<ChatModal />} />
        <Route
          path="/chats/:id"
          element={
            <PublicLayout>
              <PublicChatAreaNew />
              <PublicChatInput />
            </PublicLayout>
          }
        />

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
          <Route path='/ai-lockated' element={<OptionModal />} />
          <Route
            path="/ai-lockated/:id"
            element={
              <Layout>
                <ChatArea />
                <ChatInput />
              </Layout>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
