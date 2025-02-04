import { Send } from 'lucide-react'
import React, { useState } from 'react'
import { useChatContext } from '../contexts/chatContext';

const ChatInput = () => {
    const [input, setInput] = useState('');
    const { sendMessage } = useChatContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        sendMessage(input);
        setInput('');
    };

    return (
        <div className="border-top p-3">
            <form className="mx-auto position-relative form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="w-100 p-3 input rounded-2 border bg-transparent text-white"
                />
                <button
                    type="submit"
                    className="position-absolute p-2 border-0 rounded-1 submit-btn"
                    disabled={!input.trim()}
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    )
}

export default ChatInput