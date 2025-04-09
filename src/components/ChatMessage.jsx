import axios from 'axios';
import { Bot, Copy, Download, Pin, Share2, User, Volume2 } from 'lucide-react'
import React from 'react'
import Markdown from 'react-markdown'
import { toast } from 'react-hot-toast'

const ChatMessage = ({ message }) => {
    const token=localStorage.getItem('access_token');
    const [pin,setPinned]=React.useState(false);
    const[loading,setLoading]=React.useState(false);

    const handlePin=async()=>{
        setLoading(true);
        try {
            const response =await axios.post(`https://ai-implementation.lockated.com/pin-message/?token=${token}`,{
                message:message.content?.response || message.content,
            });

            if(response.data.success){
                setPinned(true);
                toast.success("Pinned successfully");
            }
        } catch (error) {
            toast.error("Failed to pin message. Please try again.");
        }finally{
            setLoading(false);
        }
}
const handleUnpin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://ai-implementation.lockated.com/unpin-message/?token=${token}`,
        {
          message: message.content?.response || message.content, 
        }
      );
  
      if (response.data.success) {
        setPinned(false);
        toast.success("Unpinned successfully");
      }
    } catch (error) {
      toast.error("Failed to unpin message. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

    return (
        <div>
            <div
                key={message.id}
                className={`d-flex ${message.isUser
                    ? "justify-content-end"
                    : "justify-content-start"
                    }`}
            >
                {!message.isUser && (
                    <Bot className="me-2 mt-3 text-white" size={24} />
                )}
                <div
                    className={`message px-3 py-2 ${message.isUser ? "user-message" : "bot-message"
                        }`}
                >
                    {!message.isUser ? (
                        <Markdown>
                        {
                          typeof message.content === 'string'
                            ? message.content
                            : message.content?.response || message.content?.warning || ''
                        }
                      </Markdown>
                      
                    ) : (
                        message.content
                    )}
                </div>
                {message.isUser && (
                    <User className="ms-2 mt-3 text-primary" size={24} />
                )}
            </div>
            {
                !message.isUser && (
                    <div className='d-flex align-items-center gap-3 ms-5 action-btn'>
                        <Copy size={15} color='#fafafa' className='cursor-pointer' />
                        <Volume2 size={15} color='#fafafa' className='cursor-pointer' />
                        <Download size={15} color='#fafafa' className='cursor-pointer' />
                        <Share2 size={15} color='#fafafa' className='cursor-pointer' />
                        <Pin size={15} color={loading?'#3e3e3e':'#fafafa'} fill={pin?'#fafafa':null} onClick={pin?handleUnpin:handlePin} className='cursor-pointer' />
                    </div>
                )
            }
        </div>
    )
}

export default ChatMessage