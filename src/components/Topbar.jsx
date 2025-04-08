import { Menu } from "lucide-react"
import React, { useState,createContext, useEffect } from "react"


const Topbar = ({ setIsSidebarOpen }) => {
    const data = [{ id: 0, label: "Personal" }, { id: 1, label: "Professional" }];
    const Chat_id=localStorage.getItem("current_chat");
    const [isOpen, setOpen] = useState(false);
    const [items, setItem] = useState(data);
    const [selectedItem, setSelectedItem] = useState(0);

    const toggleDropdown = () => setOpen(!isOpen);

    useEffect(() => {
        const existing = JSON.parse(localStorage.getItem("CURRENT_CHAT_MODE"));
        

        const updated = existing.filter((item) => item.id !== Chat_id);
      
        updated.push({
          mode: selectedItem,
          id: Chat_id,
        });
      
        localStorage.setItem("CURRENT_CHAT_MODE", JSON.stringify(updated));
        window.dispatchEvent(new Event("modeChanged"));
      }, [selectedItem, Chat_id]);
      

    const handleItemClick = (id) => {
        setSelectedItem(id);
        toggleDropdown();
    }

    return (
        <div className="w-100 text-white p-3 topbar ">
            <Menu className="d-md-none menu" size={20} onClick={() => setIsSidebarOpen(true)} />
            <div className='dropdown'>
                <div className='dropdown-header ' onClick={toggleDropdown}>
                    {items.find((item) => (item.id == selectedItem)).label }
                    <i className={`fa fa-chevron-right icon ${isOpen && "open"}`}></i>
                </div>
                <div className={`dropdown-body ${isOpen && 'open'}`}>
                    {items.map(item => (
                        <div
                        key={item.id}
                        className="dropdown-item"
                        onClick={() => handleItemClick(item.id)}
                      >
                        <span className={`dropdown-item-dot ${item.id == selectedItem && 'selected'}`}>• </span>
                        {item.label}
                      </div>
                      
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Topbar