import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../mor.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const openNav = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setShowModal(false);
  };

  const handleOpen = () => {
    setShowModal(true);
  };

  const signout = () => {
    console.log("Signing out...");
    sessionStorage.clear(); // Clear session storage
    localStorage.removeItem("access_token");

    setShowModal(false);

    // Remove any existing modal backdrop elements
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.remove();
    }

    navigate("/login");
  };

  const email = sessionStorage.getItem("email");
  const firstName = sessionStorage.getItem("firstname");
  const avatarLetter = firstName?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || "U";


  return (
    <>
      <div
        className="modal"
        id="userInfo"
        aria-labelledby="userInfoLabel"
        aria-hidden={!showModal}
        role="dialog"
        style={{ display: showModal ? "block" : "none" }} // React controlled visibility
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header border-0">
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleClose}
              />
            </div>
            <div className="text-center pb-2">
              <div className="avatar2">
                <div className="avatar__letters2">A</div>
              </div>
              <br />
              <h5 style={{ color: "black" }}>{firstName || "First Name"}</h5>
              <p style={{ color: "black" }}>{email || "example@example.com"}</p>
              <button
                className="purple-btn2 my-3"
                aria-label="Close"
                onClick={signout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
      <nav className="navbar navbar-expand-lg navbar-light py-2">
        <div className="container-fluid py-1 justify-content-between d-flex align-items-center">
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            onClick={openNav}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <img
            src="https://india.lockated.co/wp-content/uploads/lockated-logo-nw.png"
            alt="Logo"
            style={{ height: 40 }}
          />

          <div className="header-icons me-5">
            <ul className="d-flex gap-4 m-0">

              <li>
                <a
                  style={{

                  }}
                  className=" "
                  onClick={handleOpen}
                >
                  <svg
                    width={18}
                    height={18}
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.9618 14.0544C15.5829 13.1567 15.0329 12.3414 14.3426 11.6537C13.6544 10.9641 12.8392 10.4142 11.942 10.0345C11.9339 10.0305 11.9259 10.0285 11.9179 10.0245C13.1694 9.12047 13.983 7.64792 13.983 5.98654C13.983 3.23431 11.7531 1.00439 9.00089 1.00439C6.24866 1.00439 4.01874 3.23431 4.01874 5.98654C4.01874 7.64792 4.83236 9.12047 6.08392 10.0265C6.07589 10.0305 6.06785 10.0325 6.05982 10.0365C5.15982 10.4162 4.35223 10.9606 3.65915 11.6557C2.9695 12.3439 2.41965 13.1592 2.03995 14.0564C1.66694 14.9348 1.46576 15.8766 1.44732 16.8307C1.44678 16.8522 1.45054 16.8735 1.45838 16.8935C1.46621 16.9134 1.47797 16.9316 1.49294 16.947C1.50792 16.9623 1.52582 16.9745 1.54558 16.9829C1.56535 16.9912 1.58658 16.9955 1.60803 16.9955H2.81339C2.90178 16.9955 2.97209 16.9252 2.9741 16.8388C3.01428 15.2879 3.63705 13.8354 4.73794 12.7345C5.877 11.5955 7.38973 10.9687 9.00089 10.9687C10.612 10.9687 12.1248 11.5955 13.2638 12.7345C14.3647 13.8354 14.9875 15.2879 15.0277 16.8388C15.0297 16.9272 15.1 16.9955 15.1884 16.9955H16.3937C16.4152 16.9955 16.4364 16.9912 16.4562 16.9829C16.476 16.9745 16.4939 16.9623 16.5088 16.947C16.5238 16.9316 16.5356 16.9134 16.5434 16.8935C16.5512 16.8735 16.555 16.8522 16.5545 16.8307C16.5344 15.8705 16.3355 14.9363 15.9618 14.0544ZM9.00089 9.44189C8.07879 9.44189 7.21093 9.0823 6.55803 8.42939C5.90513 7.77649 5.54553 6.90864 5.54553 5.98654C5.54553 5.06444 5.90513 4.19658 6.55803 3.54368C7.21093 2.89078 8.07879 2.53118 9.00089 2.53118C9.92299 2.53118 10.7908 2.89078 11.4437 3.54368C12.0966 4.19658 12.4562 5.06444 12.4562 5.98654C12.4562 6.90864 12.0966 7.77649 11.4437 8.42939C10.7908 9.0823 9.92299 9.44189 9.00089 9.44189Z"
                      fill="#8B0203"
                    />
                  </svg>
                  Profile
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
