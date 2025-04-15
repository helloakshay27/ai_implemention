import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./login.css";
import toast from "react-hot-toast";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedContent, setSelectedContent] = useState("content1");
    const [showOtpSection, setShowOtpSection] = useState(false); // State to control OTP section visibility

    const [OtpSection, setOtpSection] = useState(true); // State to control OTP section visibility

    const navigate = useNavigate();

    const toggleContent = (content) => {
        setSelectedContent(content);
    };

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            setLoading(false);
            return;
        }
    
        try {
            const response = await axios.post("https://ai-implementation.lockated.com/login/", {
                email,
                password,
            });
    
            const user = response.data?.user;
    
            if (user) {
                localStorage.setItem("access_token", user.api_key);
                sessionStorage.setItem("email", user.email);
                sessionStorage.setItem("firstname", user.first_name || "");
                sessionStorage.setItem("lastname", user.last_name || "");
    
                navigate("/");
            } else {
                setError("Login failed. Please check your credentials.");
            }
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred during login. Please try again");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!mobile || !/^\d{10}$/.test(mobile)) {
            setError("Please enter a valid 10-digit mobile number.");
            return;
        }
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                `https://panchshil-super.lockated.com/generate_code`,
                {
                    mobile
                }
            );
            console.log("OTP sent successfully:", response.data);
            setOtpSection(false);
            toast.success("OTP Sent successfully")


            setShowOtpSection(true);

        } catch (err) {
            toast.error("Failed to send OTP. Please try again.")

            console.error(err);
            // setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            setError("Please enter a valid  OTP.");
            return;
        }
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                `https://panchshil-super.lockated.com/verify_code.json`,
                {
                    // email,
                    mobile,
                    otp
                }
            );

            const { access_token, email, firstname } = response.data;
            console.log("OTP verified successfully:", response.data);

            if (access_token) {
                localStorage.setItem("access_token", access_token);
                sessionStorage.setItem("email", email);
                sessionStorage.setItem("firstname", firstname);

                navigate("/");
                toast.success("Login successfully")

            } else {
                setError("Login failed. Please check your credentials.");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "An error occurred during login. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const regiterPage = () => {

        navigate("/register")
    };

    return (
        <div>
            <main>
                <section className="login_module">
                    <div className="container-fluid">
                        <div className="row align-items-center vh-100 login_bg justify-content-end">
                            <div className="col-lg-4 col-md-7 vh-50 ">
                                <div className="login-sec">
                                                                <img
                                src="https://s3-alpha-sig.figma.com/img/fac0/3f4f/1f8a83367d13fa9e1e88aed5b7967bf7?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=rix9zVX3jLBmGWFn5fCH5E0uzEE6JYipa-xNwx3Uc-UdUl2Jvv4riYmB5p~JlvyP5wekeU80EIDL5816BavGoJDfp3Ts~53-qNwmtMPnMil5IHdsIA2kAPSr3s26-EYyU7eShR~iemoGkcLsaHHk-JujvqIU0eva6REiclqoQSTGUmt4brymQhf~KLtU6GDgi3td45QdG8feJAPmm2dS80zUVq1cMnE0ZCdYbk77oBZhZDC00lXSqTHwEinQToz0xB8zIWM1dNN7ibNMW1f9hilA2KJkAM81G03h7SXw6eBKRbK7DFaDCe1XjCpBB3wF5N0DgjCjNEu4dxHC6lMWRw__"
                                alt="Logo"
                                style={{
                                    width: "192px",
                                    height: "42px",
                                    margin: "10px auto 100px", // top = 0, horizontal = auto (center), bottom = 100px
                                    display: "block"
                                }}
                                />



                                    {selectedContent === "content1" && (
                                        <div className="mt-2 login-content">
                                            <div className="form-group position-relative">
                                            <label className="mb-3 label-muted" htmlFor="email" >
  Email ID
</label>

                                                <input
                                                    type="email"
                                                    id="email"
                                                    className="form-control custom-input"
                                                    style={{ color: "#667085" }}
                                                    placeholder="Enter email Id"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group position-relative">
                                                <label className="mb-3 label-muted" htmlFor="password">Password</label>
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
                                            <div className="d-flex justify-content-end mb-3 ">
                                                <a className="forget-btn" href="/forgot-password">
                                                    Forgot password?
                                                </a>
                                                <br />
                                            </div>


                                            {error && <p className="text-danger">{error}</p>}
                                            <button onClick={handlePasswordLogin} type="submit" className=" purple-btn2 " style={{display:"block"}}>
                                                {loading ? "Logging in..." : "Login"}
                                            </button>
                                            <button className=" purple-btn2  " onClick={regiterPage} style={{ opacity:`1`, color: "#C72030" ,border: "1px solid #C72030" ,background: "none" ,display:"block"}}>
                                                {loading ? "Register in..." : "Register"}
                                            </button>



                                        </div>
                                    )}

                                    {selectedContent === "content2" && (
                                        <form onSubmit={handleVerifyOtp} className="mt-3 login-content">
                                            {

                                                OtpSection && (
                                                    <div className="form-group position-relative">
                                                        <label className="mb-1" htmlFor="mobile">Mobile Number</label>
                                                        <input
                                                            type="tel"
                                                            id="mobile"
                                                            className="form-control mb-2"
                                                            placeholder="Enter mobile number"
                                                            value={mobile}
                                                            onChange={(e) => setMobile(e.target.value)}
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger mt-2"
                                                            onClick={handleSendOtp}
                                                        >
                                                            Send OTP
                                                        </button>
                                                    </div>

                                                )
                                            }

                                            {showOtpSection && (
                                                <div className="form-group position-relative">
                                                    <label className="mb-1" htmlFor="otp">Enter OTP</label>
                                                    <input
                                                        type="text"
                                                        id="otp"
                                                        className="form-control mb-2"
                                                        placeholder="Enter OTP"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            )}

                                            {/* Error Message */}
                                            {error && <p className="text-danger">{error}</p>}

                                            {/* Verify OTP Button (Conditionally Rendered) */}
                                            {showOtpSection && (
                                                <button type="submit" className="btn btn-danger mt-2">
                                                    Verify OTP
                                                </button>


                                            )}
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SignIn;
