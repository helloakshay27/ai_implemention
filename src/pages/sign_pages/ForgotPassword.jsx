import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [number, setNumber] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

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
        <div className="row align-items-center vh-100 login_bg justify-content-center">
          <div className="col-lg-7 col-md-7 vh-50 d-flex align-items-center">
            <div className="login-sec" style={{ padding: "1% 8%" }}>
              <img
                className="logo_img"
                style={{ width: 100, height: 85, margin: "auto" }}
                src="https://lockated.com/assets/logo-87235e425cea36e6c4c9386959ec756051a0331c3a77aa6826425c1d9fabf82e.png"
                alt="Logo"
              />

              <form className="mt-2 login-content">

                  <div className="form-group position-relative">
                    <label className="mb-1" htmlFor="number">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="number"
                      className="form-control mb-2"
                      placeholder="Enter Phone Number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      required
                    />
                  </div>


                {message && (
                  <>
                  <div className="confirm-box my-3" >
                    <p className="mb-1 fw-bold" style={{textAlign: "left", marginLeft: "10px"}}>{message}</p>
                    <select
                      value={confirm}
                      onChange={(e) =>{ setConfirm(e.target.value)
                        if(e.target.value === "no")
                          {
                              setEmail("");
                        }
                      }
                    }
                      className="form-control"
                      required
                    >
                      <option value="" disabled>
                        Choose
                      </option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                    <div className="form-group position-relative">
                    <label className="mb-1" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="text"
                      id="number"
                      className="form-control mb-2"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    </div>
                    </>
                )}

                {error && <p className="text-danger">{error}</p>}

                {!email ? (
                  <button
                    type="submit"
                    className="btn btn-danger mt-2 purple-btn2"
                    onClick={handleFindAccount}
                    disabled={loading}
                  >
                    {loading ? "Finding..." : "Find Account"}
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-success mt-2 purple-btn2"
                    onClick={handleReset}
                    disabled={loading || !confirm}
                  >
                    {loading ? "Sending Reset..." : "Send Reset Link"}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
