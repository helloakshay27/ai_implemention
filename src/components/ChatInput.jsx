import { useParams } from 'react-router-dom';
import { useChatContext } from '../contexts/chatContext';
import InputBox from './InputBox';

const ChatInput = () => {
    const { id } = useParams()
    const { messages } = useChatContext();

    return (
        <>
            <div className="border-top p-3 chat-input" style={{
                background: "#FCFBF9",
            }}>
                <InputBox id={id} />
            </div>
        </>
    );
};

export default ChatInput;
