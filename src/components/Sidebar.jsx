import { MessageSquare, Plus, Trash, X } from "lucide-react";
import { useChatContext } from "../contexts/chatContext";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { chats, currentChatId, createNewChat, deleteChat, setCurrentChatId } = useChatContext();

    return (
        <>
            <div className={`sidebar ${isSidebarOpen ? "show" : ""}`}>
                <div className="d-flex justify-content-between align-items-center p-3 gap-4 mt-3">
                  
                        <img style={{cursor: 'pointer'}} onClick={createNewChat} src="pajamas_duo-chat-new.svg" alt="Chat Icon" />
               
                    <button
                        className="btn text-white d-md-none p-0"
                        onClick={() => {
                            setIsSidebarOpen(false);
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-grow-1 overflow-y-auto">
                    {chats.map((chat) => {
                        return (
                            <div
                                key={chat.id}
                                className={`d-flex align-items-center justify-content-between gap-2 p-3 text-black chat ${currentChatId === chat.id ? 'active' : ''}`}
                                onClick={() => setCurrentChatId(chat.id)}
                            >
                                <MessageSquare className="mt-1" size={20} />
                                <span className="text-truncate" style={{fontSize: '14px'}}>{chat.title}</span>
                                <button
                                    className="btn text-white p-0"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteChat(chat.id);
                                    }}
                                >
                                    <Trash color="red"className="trash" size={20} />
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div>
                <img
                                src="https://s3-alpha-sig.figma.com/img/fac0/3f4f/1f8a83367d13fa9e1e88aed5b7967bf7?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=rix9zVX3jLBmGWFn5fCH5E0uzEE6JYipa-xNwx3Uc-UdUl2Jvv4riYmB5p~JlvyP5wekeU80EIDL5816BavGoJDfp3Ts~53-qNwmtMPnMil5IHdsIA2kAPSr3s26-EYyU7eShR~iemoGkcLsaHHk-JujvqIU0eva6REiclqoQSTGUmt4brymQhf~KLtU6GDgi3td45QdG8feJAPmm2dS80zUVq1cMnE0ZCdYbk77oBZhZDC00lXSqTHwEinQToz0xB8zIWM1dNN7ibNMW1f9hilA2KJkAM81G03h7SXw6eBKRbK7DFaDCe1XjCpBB3wF5N0DgjCjNEu4dxHC6lMWRw__"
                                alt="Logo"
                                style={{
                                    width: "143px",
                                    height: "31px",
                                    margin: "30px auto", // top = 0, horizontal = auto (center), bottom = 100px
                                    display: "block"
                                }}
                                />
                </div>
            </div>
        </>
    );
};

export default Sidebar;
