import React, { useState } from "react";
import "../mor.css";
import { useNavigate } from "react-router-dom";
import { SidebarCloseIcon } from "lucide-react";
import { useChatContext } from "../contexts/chatContext";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {

  const { createNewChat } = useChatContext()

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

  const email = localStorage.getItem("email");
  const firstName = localStorage.getItem("firstname");
  const lastName = localStorage.getItem("lastname");
  const avatarLetter =
    firstName?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || "U";

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
              <div className="avatar2 mx-auto">
                <div className="avatar__letters2">{avatarLetter}</div>
              </div>
              <br />
              <h5
                style={{
                  color: "black",
                  display: "inline",
                  marginRight: "5px",
                }}
              >
                {firstName || "FirstName"}
              </h5>
              <h5 style={{ color: "black", display: "inline" }}>
                {lastName || "LastName"}
              </h5>
              <p className="text-muted">{email || "example@example.com"}</p>
              <button
                className="purple-btn2 my-3"
                style={{
                  width: "75%",
                  backgroundColor: "rgba(196, 184, 157, 0.35)",
                  color: "rgba(199, 32, 48, 1)",
                }}
                aria-label="Close"
                onClick={signout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
      <nav className={`${isSidebarOpen ? "custom-header-full" : "custom-header"} z-1`}>
        {isSidebarOpen && (
          <>
            <SidebarCloseIcon
              size={25}
              className="cursor-pointer position-fixed"
              style={{ top: "15px", left: "10px" }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <img
              className="cursor-pointer position-fixed"
              style={{ cursor: "pointer", top: "16px", left: "50px" }}
              onClick={createNewChat}
              src="/newchat.svg"
              alt="Chat Icon"
            />
          </>
        )}
        <div
          className="avatar2"
          style={{
            height: "32px",
            width: "32px",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: "50%",
            cursor: "pointer"
          }}
          onClick={handleOpen}
        >
          <div style={{ fontSize: "18px" }}>{avatarLetter}</div>
        </div>
      </nav>
    </>
  );
};

export default Header;
