import { FileSpreadsheet, MessagesSquareIcon } from "lucide-react";
import { useChatContext } from "../contexts/chatContext";

const OptionModal = () => {
    const { createNewChat, setMode } = useChatContext();
    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center z-3"
            style={{ backgroundColor: "#fffaf1" }}
        >
            <button
                className="purple-btn2 d-flex align-items-center gap-2 justify-content-center"
                style={{ width: "250px", backgroundColor: "#E3DED5", color: "#C72030" }}
                onClick={() => {
                    createNewChat();
                    setMode("BRD")
                }}
            >
                <FileSpreadsheet size={20} /> BRD
            </button>
            <button
                className="purple-btn2 d-flex align-items-center gap-2 justify-content-center"
                style={{ width: "250px", backgroundColor: "#E3DED5", color: "#C72030" }}
                onClick={() => {
                    createNewChat();
                    setMode("CHATS")
                }}
            >
                <MessagesSquareIcon size={20} /> CHATS
            </button>
        </div>
    );
};

export default OptionModal;
