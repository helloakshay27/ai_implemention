import { useChatContext } from '../contexts/chatContext';
import InputBox from './InputBox';

const ChatInput = () => {
    const { chats, currentChatId } = useChatContext();
    const currentChat = chats.find((chat) => chat.id === currentChatId);

    return (
        <>
            {currentChat?.messages?.length > 0 && (
                <div className="border-top p-3 chat-input" style={{
                    background: "#FCFBF9",
                }}>
                    <InputBox />
                </div>
            )}
        </>
    );
};

export default ChatInput;
