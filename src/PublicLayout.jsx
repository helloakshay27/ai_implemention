import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { MessageSquare, SidebarCloseIcon, Trash, X } from "lucide-react";

// Import chat type icons
import generalIcon from "/assets/general.png";
import imageIcon from "/assets/image.png";
import structuredIcon from "/assets/structured.png";
import textIcon from "/assets/text.png";

const PublicLayout = ({ children }) => {
  const location = useLocation();
  const { id } = useParams();

  const noTier = location.pathname.includes("/tiers");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Keyboard shortcuts for sidebar control
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + B to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
      // Escape key to close sidebar
      if (e.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen]);

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <>
      <div className="website-content">
        <PublicSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className={`${isSidebarOpen ? "main-full" : "main"}`}>
          <PublicHeader
            noTier={noTier}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          {children}
        </main>


      </div>
    </>
  );
};

// Public sidebar (exact same structure as protected Sidebar)
const PublicSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [publicChats, setPublicChats] = useState([]);

  // Load public chats from localStorage
  const loadPublicChats = () => {
    const chats = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("public_messages_")) {
        const chatId = key.replace("public_messages_", "");
        const messages = JSON.parse(localStorage.getItem(key) || "[]");
        if (messages.length > 0) {
          // Get first user message for chat title
          const firstUserMessage = messages.find(
            (msg) => msg.query?.user_prompt
          );
          const chatTitle = firstUserMessage?.query?.user_prompt || "New Chat";

          // Get chat type
          const chatType =
            localStorage.getItem(`chat_type_${chatId}`) || "general";

          chats.push({
            conversation_token: chatId,
            title: chatTitle,
            type: chatType,
            messageCount: messages.length,
            lastMessage:
              messages[messages.length - 1]?.query?.user_prompt ||
              "No messages",
          });
        }
      }
    }
    setPublicChats(
      chats.sort((a, b) =>
        b.conversation_token.localeCompare(a.conversation_token)
      )
    );
  };

  const deletePublicChat = (chatId) => {
    localStorage.removeItem(`public_messages_${chatId}`);
    localStorage.removeItem(`chat_type_${chatId}`); // Also remove the chat type
    loadPublicChats(); // Reload chats after deletion
  };

  const createNewPublicChat = () => {
    navigate("/chats");
  };

  useEffect(() => {
    loadPublicChats();

    // Handle window resize for responsive behavior
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Desktop: Sidebar can stay open
        return;
      } else {
        // Mobile: Close sidebar to prevent overlap
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reload chats when the route changes (new chat, navigation, etc.)
  useEffect(() => {
    loadPublicChats();
  }, [location.pathname, id]);

  // Listen for custom events to reload chats
  useEffect(() => {
    const handleStorageChange = () => {
      loadPublicChats();
    };

    // Listen for storage changes in other tabs/windows
    window.addEventListener("storage", handleStorageChange);

    // Listen for custom events dispatched by our app
    window.addEventListener("chatUpdated", handleStorageChange);
    window.addEventListener("chatCreated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("chatUpdated", handleStorageChange);
      window.removeEventListener("chatCreated", handleStorageChange);
    };
  }, []);

  return (
    <>
      {/* Sidebar Overlay - covers entire screen when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
          // style={{
          //   position: "fixed",
          //   top: 0,
          //   left: 0,
          //   width: "100vw",
          //   height: "100vh",
          //   backgroundColor: "rgba(0, 0, 0, 0.5)",
          //   zIndex: 1050,
          //   cursor: "pointer",
          // }}
        />
      )}

      <div className={`sidebar ${isSidebarOpen ? "show" : ""}`} style={{ zIndex: 1051 }}>
        <div className="d-flex justify-content-between align-items-center p-2 p-md-3 gap-2 gap-md-4">
          {/* Close sidebar button */}
          <button
            className="btn text-white p-1 p-md-0 d-flex align-items-center justify-content-center"
            onClick={() => setIsSidebarOpen(false)}
            title="Close Sidebar"
            style={{
              minWidth: "32px",
              minHeight: "32px",
              borderRadius: "8px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <SidebarCloseIcon color="#000000" size={window.innerWidth < 768 ? 20 : 25} />
          </button>

          {/* New chat button */}
          <button
            className="btn p-1 p-md-0 d-flex align-items-center justify-content-center"
            onClick={createNewPublicChat}
            title="Start New Chat"
            style={{
              minWidth: "32px",
              minHeight: "32px",
              borderRadius: "8px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <img
              src="/newchat.svg"
              alt="New Chat"
              style={{ 
                width: window.innerWidth < 768 ? "20px" : "24px",
                height: window.innerWidth < 768 ? "20px" : "24px",
                cursor: "pointer" 
              }}
            />
          </button>
        </div>

        <div className="flex-grow-1 overflow-y-auto">
          {publicChats.map((chat) => {
            // Get the stored type for this chat
            const storedType =
              chat.type ||
              localStorage.getItem(`chat_type_${chat.conversation_token}`) ||
              "general";

            // Get chat title (first message or default)
            const chatTitle =
              chat.title && chat.title !== "New Chat" ? chat.title : "New Chat";

            // Type icon mapping with images
            const typeIcons = {
              text: textIcon,
              image: imageIcon,
              structured: structuredIcon,
              general: generalIcon,
            };

            // Width logic for different icon types
            const iconWidths = {
              text: "16px",
              image: "24px",
              structured: "24px",
              general: "16px",
            };

            return (
              <div
                key={chat.conversation_token}
                className={`d-flex align-items-center justify-content-between gap-2 p-3 text-black chat ${
                  id === chat.conversation_token ? "active" : ""
                }`}
                onClick={() =>
                  navigate(
                    `/chats/${chat.conversation_token}?type=${storedType}`
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex align-items-start gap-2 flex-grow-1 overflow-hidden">
                  <img
                    src={typeIcons[storedType] || generalIcon}
                    alt={`${storedType} icon`}
                    style={{
                      width: iconWidths[storedType] || "16px",
                      height: iconWidths[storedType] || "16px",
                      flexShrink: 0,
                      objectFit: "contain",
                    }}
                  />
                  <span
                    className="text-truncate"
                    style={{
                      fontSize: "14px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: "1.4",
                    }}
                    title={chatTitle}
                  >
                    {chatTitle}
                  </span>
                </div>
                <button
                  className="btn text-white p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePublicChat(chat.conversation_token);
                  }}
                  style={{ flexShrink: 0 }}
                >
                  <Trash color="#C72030" size={18} />
                </button>
              </div>
            );
          })}

          {publicChats.length === 0 && (
            <div className="text-center text-muted p-3">
              <small>No chats yet</small>
            </div>
          )}
        </div>
      
      </div>
    </>
  );
};

// Public header (exact same structure as protected Header)
const PublicHeader = ({ noTier, isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const createNewPublicChat = () => {
    navigate("/chats");
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleOpen = () => {
    setShowModal(true);
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <div
        className="modal"
        id="publicUserInfo"
        aria-labelledby="publicUserInfoLabel"
        aria-hidden={!showModal}
        style={{
          display: showModal ? "block" : "none",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onClick={handleClose}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="modal-content"
            style={{ borderRadius: "16px", border: "none" }}
          >
            {/* Close button in top right */}
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                zIndex: 1,
              }}
            ></button>

            {/* Modal Body - Centered content */}
            <div className="modal-body text-center py-5 px-4">
              {/* Profile Avatar */}
              <div className="d-flex justify-content-center mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#fff",
                    border: "3px solid #C72030",
                    color: "#C72030",
                    fontSize: "36px",
                    fontWeight: "bold",
                  }}
                >
                  p
                </div>
              </div>

              {/* User Name */}
              <h5
                className="mb-2"
                style={{ fontSize: "24px", fontWeight: "600", color: "#333" }}
              >
                Public
              </h5>

              {/* Email */}
              <p className="text-muted mb-4" style={{ fontSize: "16px" }}>
                public@example.com
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${isSidebarOpen ? "custom-header-full" : "custom-header"}`}
      >
        <div className="d-flex align-items-center gap-2 gap-md-3">
          {/* Sidebar toggle button - visible when sidebar is closed */}
          {!isSidebarOpen && (
            <button
              className="btn text-dark p-1 p-md-0 d-flex align-items-center justify-content-center"
              onClick={() => setIsSidebarOpen(true)}
              style={{ 
                cursor: "pointer",
                minWidth: "32px",
                minHeight: "32px",
                borderRadius: "8px",
                transition: "all 0.2s ease"
              }}
              title="Open Sidebar"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <SidebarCloseIcon color="#000000" size={window.innerWidth < 768 ? 20 : 25} />
            </button>
          )}

          {/* New Chat button - visible when sidebar is closed */}
          {!isSidebarOpen && (
            <button
              className="btn p-1 p-md-0 d-flex align-items-center justify-content-center"
              onClick={createNewPublicChat}
              style={{ 
                cursor: "pointer",
                minWidth: "32px",
                minHeight: "32px",
                borderRadius: "8px",
                transition: "all 0.2s ease"
              }}
              title="Start New Chat"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <img
                src="/newchat.svg"
                alt="New Chat"
                style={{ 
                  width: window.innerWidth < 768 ? "20px" : "24px",
                  height: window.innerWidth < 768 ? "20px" : "24px"
                }}
              />
            </button>
          )}
        </div>

        <div className="header-icons">
          <div className="position-relative">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: window.innerWidth < 768 ? "36px" : "40px",
                height: window.innerWidth < 768 ? "36px" : "40px",
                backgroundColor: "#C72030",
                color: "white",
                cursor: "pointer",
                fontSize: window.innerWidth < 768 ? "14px" : "16px",
                fontWeight: "bold",
                transition: "all 0.2s ease"
              }}
              onClick={handleOpen}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              P
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicLayout;
