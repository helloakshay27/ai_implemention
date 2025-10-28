import { useParams, useSearchParams } from 'react-router-dom';
import PublicInputBox from './PublicInputBox';

const PublicChatInput = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const chatType = searchParams.get('type') || 'general';

    return (
        <>
            <div className="border-top p-3 chat-input" style={{
                background: "#FCFBF9",
            }}>
                <PublicInputBox id={id} chatType={chatType} />
            </div>
        </>
    );
};

export default PublicChatInput;
