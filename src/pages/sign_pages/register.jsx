import React, { useState,useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {toast} from "react-hot-toast";

import "./login.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [OTP,SetOTP]=useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
const [resendTimer, setResendTimer] = useState(300); 
const timerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();



  const startResendTimer = () => {
    setResendDisabled(true);
    setResendTimer(300);
  
    if (timerRef.current) clearInterval(timerRef.current);
  
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  


const handleResendOTP=async(e)=>{
  e.preventDefault();
  setError(""); // Reset error state
  setLoading(true);

   try {
     const response = await axios.post("https://ai-implementation.lockated.com/resend-otp/", {
      email,
     })

     if(response.data.message){
      toast.success("OTP sent successfully");
      startResendTimer();
      setLoading(false);
     }
    }
     catch(error){
      setError(error.response?.data?.error || "Failed to send OTP. Please try again.");
     }finally{
      setLoading(false);
     }
}
  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response= await axios.post("https://ai-implementation.lockated.com/verify-otp/",{
        email,
        otp:OTP
      }); 

      if (response.data.token) {
        localStorage.setItem("access_token", response.data.token);
        sessionStorage.setItem("email", response.data.email);
        sessionStorage.setItem("firstname", response.data.firstname);
        sessionStorage.setItem("lastname", response.data.lastname);
      }
      navigate("/");
      toast.success("Registered successfully");
      setLoading(false);

    } catch (error) {
      setError(error.response?.data?.error || "Failed to verify OTP. Please try again.");
    }finally{
      setLoading(false);
    }

  }
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);

    // Email validation
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
     setError("Please enter a valid email address.");
     setLoading(false);
     return;
   }

   // Phone number validation (Indian format: 10 digits, starts with 6-9)
   const phoneRegex = /^[6-9]\d{9}$/;
   if (!phoneRegex.test(mobile)) {
     setError("Please enter a valid 10-digit mobile number.");
     setLoading(false);
     return;
   }



    try {
      const response = await axios.post("https://ai-implementation.lockated.com/signup/", {
        email,
        first_name:firstname,
        last_name:lastname,
        mobile,
        password,
      });

      if(response.data.user){
        toast.success("OTP sent successfully");
        setShowOtpSection(true);
        setLoading(false);
        startResendTimer();
      }

      else {
        setError("User already exists");
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Server Error");
    } finally {
      setLoading(false);
    }
  };


  const redirectPage = () => {
    navigate("/login")
  };

  return (
    <div>
      <main>
        <section className="login_module">
          <div className="container-fluid">
            <div className="row align-items-center min-vh-100 login_bg justify-content-end">
              <div className="col-lg-4 col-md-7 vh-50 d-flex align-items-center">
                <div className="login-sec">
                  <img
                    className="logo_img"
                    style={{  width: "192px",
                      height: "42px",
                      margin: "10px auto 20px", // top = 0, horizontal = auto (center), bottom = 100px
                      display: "block" }}
                    src="https://s3-alpha-sig.figma.com/img/fac0/3f4f/1f8a83367d13fa9e1e88aed5b7967bf7?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=rix9zVX3jLBmGWFn5fCH5E0uzEE6JYipa-xNwx3Uc-UdUl2Jvv4riYmB5p~JlvyP5wekeU80EIDL5816BavGoJDfp3Ts~53-qNwmtMPnMil5IHdsIA2kAPSr3s26-EYyU7eShR~iemoGkcLsaHHk-JujvqIU0eva6REiclqoQSTGUmt4brymQhf~KLtU6GDgi3td45QdG8feJAPmm2dS80zUVq1cMnE0ZCdYbk77oBZhZDC00lXSqTHwEinQToz0xB8zIWM1dNN7ibNMW1f9hilA2KJkAM81G03h7SXw6eBKRbK7DFaDCe1XjCpBB3wF5N0DgjCjNEu4dxHC6lMWRw__"
                    alt="Logo"
                  />

                  <form
                    className="mt-2 login-content"
                    
                  >
                    <div className="form-group position-relative">
                      <label className="label-muted" htmlFor="email">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="email"
                        className="form-control mb-2 custom-input"
                        placeholder="Enter firstname"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group position-relative">
                      <label className="label-muted" htmlFor="password">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="password"
                        className="form-control custom-input"
                        placeholder="Enter lastname"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group position-relative">
                      <label className="label-muted" htmlFor="Email">
                        Email
                      </label>
                      <input
                        type="Email"
                        id="password"
                        className="form-control custom-input"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group position-relative">
                      <label className="label-muted" htmlFor="email">
                        Mobile
                      </label>
                      <input
                        type="tel"
                        id="email"
                        className="form-control mb-2 custom-input"
                        placeholder="Enter mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group position-relative">
                      <label className="label-muted" htmlFor="password">Password</label>
                      <input
                        type="password"
                        id="password"
                        className="form-control custom-input"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  {showOtpSection &&(
                    <>
                    <div className="form-group position-relative">
                      <label className="label-muted" htmlFor="otp">Verify Email</label>
                      <input
                        type="number"
                        id="number"
                        className="form-control custom-input"
                        placeholder="Enter OTP"
                        value={OTP}
                        onChange={(e) => SetOTP(e.target.value)}
                        required
                      />
                      <button
                      type="button"
                      className="btn btn-sm mt-2"
                      disabled={resendDisabled}
                      style={{
                        backgroundColor: resendDisabled ? "#ccc" : "#6c63ff",
                        color: resendDisabled ? "#666" : "#fff",
                        cursor: resendDisabled ? "not-allowed" : "pointer",
                      }}
                      onClick={(e) => {handleResendOTP(e)}}
                    >
                      {resendDisabled ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                    </button>
                    </div>
                    </>
                  )}

                    {error && <p className="text-danger">{error}</p>}
                    {showOtpSection ? (
                      <button type="submit" className=" purple-btn2" onClick={(e) => handleSubmitOTP(e)}>
                      {loading ? "Verifying..." : "Verify Email"}
                    </button>
                    ):(
                    <button type="submit" className=" purple-btn2" onClick={(e) => handlePasswordLogin(e)}>
                      {loading ? "Register in..." : "Register"}
                    </button>
                    )}

                    <p className="mt-3 text-center text-muted">
                      Already have an account?
                      < Link style={{ color: "#C72030" ,fontWeight:"400px",fontSize:"12px"}} to="/login">LOGIN</Link>
                    </p>

                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Register;
