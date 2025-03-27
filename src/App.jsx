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

import RootLayout from "./pages/sign_pages/RootLayout";
import ProtectedRoute from "./pages/sign_pages/ProtectedRoute";

import "./mor.css";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<Forgot />} />
        <Route path="/forgot-otp" element={<ForgotOtp />} />
        <Route path="/reset-password" element={<CreatePassword />} />

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
                <ChatInput />
              </Layout>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
