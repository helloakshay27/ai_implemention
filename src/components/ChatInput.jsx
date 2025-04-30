import { useParams } from 'react-router-dom';
import InputBox from './InputBox';

const ChatInput = () => {
    const { id } = useParams()

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
