import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [number, setNumber] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [toggle,setToggle]=useState(false);



  const handleClick=(s)=>{
    setToggle(!toggle);
    setConfirm(s);
  }
  console.log(toggle);
  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://ai-implementation.lockated.com/confirm-reset/", {
        email,
        confirmation: confirm
      });

      if (response.data) {
        toast.success("Password reset link sent successfully");
        setLoading(false);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  const handleFindAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://ai-implementation.lockated.com/initiate-reset/", {
        identifier: number
      });

      if (response.data.email) {
        setEmail(response.data.email);
        setMessage(response.data.message);
      }
      
    } catch (error) {
      setError(error.response?.data?.error || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login_module">
      <div className="container-fluid">
        <div className="row align-items-center vh-100 login_bg justify-content-end">
          <div className="col-lg-4 col-md-7 vh-50 d-flex align-items-center">
            <div className="login-sec" >
              <img
                className="logo_img"
                style={{ 
                  width: "192px",
                  height: "42px",
                  margin: "10px auto 100px", // top = 0, horizontal = auto (center), bottom = 100px
                  display: "block"
                }}
                src="https://s3-alpha-sig.figma.com/img/fac0/3f4f/1f8a83367d13fa9e1e88aed5b7967bf7?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=rix9zVX3jLBmGWFn5fCH5E0uzEE6JYipa-xNwx3Uc-UdUl2Jvv4riYmB5p~JlvyP5wekeU80EIDL5816BavGoJDfp3Ts~53-qNwmtMPnMil5IHdsIA2kAPSr3s26-EYyU7eShR~iemoGkcLsaHHk-JujvqIU0eva6REiclqoQSTGUmt4brymQhf~KLtU6GDgi3td45QdG8feJAPmm2dS80zUVq1cMnE0ZCdYbk77oBZhZDC00lXSqTHwEinQToz0xB8zIWM1dNN7ibNMW1f9hilA2KJkAM81G03h7SXw6eBKRbK7DFaDCe1XjCpBB3wF5N0DgjCjNEu4dxHC6lMWRw__"
                alt="Logo"
              />

              <form className="mt-2 login-content">

                  <div className="form-group position-relative">
                    <label className="mb-2 label-muted" htmlFor="number">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="number"
                      className="form-control mb-2 custom-input"
                      placeholder="Enter Phone Number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      required
                    />
                  </div>


                {message && (
                  <>
                  <div className="confirm-box my-3" >
                    <p className="mb-1 " style={{textAlign: "left", marginLeft: "10px", color:"#323232",display:"inline"}}>{message}</p>
                    <div>
                      <input placeholder="Choose" className="form-control custom-select" value={confirm} style={{height:"30px"}} onClick={()=>{setToggle(!toggle)}}/>
                        {toggle && (
                          <div className="custom-select">
                              <button type="button" className="option" onClick={()=>{handleClick("yes")}}>Yes</button>
                              <button type="button" className="option" onClick={()=>{handleClick("no")}}>No</button>
                          </div>
                        )}
                    </div>
                    {/* <select
                      value={confirm}
                      onChange={(e) =>{ setConfirm(e.target.value)
                        if(e.target.value === "no")
                          {
                              setEmail("");
                        }
                      }
                    }
                      className="form-control custom-select"
                      required
                    >
                      <option value="" disabled>
                        Choose
                      </option>
                      <option className="option" value="yes">Yes</option>
                      <option className="option" value="no">No</option>
                    </select> */}
                  </div>
                  
                  {confirm === "no" &&
                    <div className="form-group position-relative">
                    <label className="mb-2 label-muted" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="text"
                      id="number"
                      className="form-control mb-2 custom-input"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    </div>
}
                    </>
                )}

                {error && <p className="text-danger">{error}</p>}

                {!email ? (
                  <button
                    type="submit"
                    className="purple-btn2"
                    onClick={handleFindAccount}
                    disabled={loading}
                  >
                    {loading ? "Finding..." : "Find Account"}
                  </button>
                ) : (
                  <button
                    type="submit"
                    className=" purple-btn2"
                    onClick={handleReset}
                    disabled={loading || !confirm}
                  >
                    {loading ? "Sending Reset..." : "Send Reset Link"}
                  </button>
                )}

                <p style={{ textAlign: "center"}}>
                  <Link to="/login" style={{color: "#323232" , fontSize: "12px"}}>Go Back</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
