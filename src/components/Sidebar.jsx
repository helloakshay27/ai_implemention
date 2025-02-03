import { MessageSquare, Plus, Trash, X } from "lucide-react";
import { useChatContext } from "../contexts/chatContext";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { chats, currentChatId, createNewChat, deleteChat, setCurrentChatId } = useChatContext();

    return (
        <>
            <div className={`sidebar ${isSidebarOpen ? "show" : ""}`}>
                <div className="d-flex justify-content-between align-items-center p-3 gap-4">
                    <button
                        className="d-flex align-items-center justify-content-start border-0 px-3 py-1 add-chat"
                        onClick={createNewChat}
                    >
                        <Plus size={20} /> New Chat
                    </button>
                    <button
                        className="btn text-white d-md-none p-0"
                        onClick={() => {
                            setIsSidebarOpen(false);
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto">
                    {chats.map((chat) => {
                        return (
                            <div
                                key={chat.id}
                                className={`d-flex align-items-center justify-content-between gap-2 p-3 text-white chat ${currentChatId === chat.id ? 'active' : ''}`}
                                onClick={() => setCurrentChatId(chat.id)}
                            >
                                <MessageSquare className="mt-1" size={20} />
                                <span className="text-truncate">{chat.title}</span>
                                <button
                                    className="btn text-white p-0"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteChat(chat.id);
                                    }}
                                >
                                    <Trash className="trash" size={20} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
