import React, { useState } from "react";
import { FileText, Image, Database, MessageSquare } from "lucide-react";

const ChatModal = () => {
    const [selectedType, setSelectedType] = useState(null);
    const [chatId, setChatId] = useState(null);

    // Create a new chat without authentication
    const createNewPublicChat = () => {
        // Generate a simple chat ID for public chats
        const newChatId = `chat_${Date.now()}`;
        setChatId(newChatId);
        
        // Store in localStorage for persistence
        localStorage.setItem("public_chat_id", newChatId);
        
        return newChatId;
    };

    const handleTypeSelection = (type) => {
        setSelectedType(type);
        const id = createNewPublicChat();
        
        // Store the chat type for this chat ID
        localStorage.setItem(`chat_type_${id}`, type);
        
        // Dispatch custom event to notify sidebar to reload
        window.dispatchEvent(new Event('chatCreated'));
        
        // Navigate to the chat with the selected type (mandatory in URL)
        window.location.href = `/chats/${id}?type=${type}`;
    };

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center z-3"
            style={{ backgroundColor: "#fffaf1" }}
        >
            <button
                className="purple-btn2 d-flex align-items-center gap-2 justify-content-center"
                style={{ width: "250px", backgroundColor: "#E3DED5", color: "#C72030" }}
                onClick={() => handleTypeSelection("text")}
            >
                <FileText size={20} /> Text Chat
            </button>
            <button
                className="purple-btn2 d-flex align-items-center gap-2 justify-content-center"
                style={{ width: "250px", backgroundColor: "#E3DED5", color: "#C72030" }}
                onClick={() => handleTypeSelection("image")}
            >
                <Image size={20} /> Image Chat
            </button>
            {/* <button
                className="purple-btn2 d-flex align-items-center gap-2 justify-content-center"
                style={{ width: "250px", backgroundColor: "#E3DED5", color: "#C72030" }}
                onClick={() => handleTypeSelection("structured")}
            >
                <Database size={20} /> Structured Data
            </button> */}
        </div>
    );
};

export default ChatModal;
