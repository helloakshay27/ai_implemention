import { Menu } from "lucide-react"
import React, { useState } from "react"


const Topbar = ({ setIsSidebarOpen }) => {
    const data = [{ id: 0, label: "Personal" }, { id: 1, label: "Professional" }];
    const [isOpen, setOpen] = useState(false);
    const [items, setItem] = useState(data);
    const [selectedItem, setSelectedItem] = useState(null);

    const toggleDropdown = () => setOpen(!isOpen);

    const handleItemClick = (id) => {
        selectedItem == id ? setSelectedItem(null) : setSelectedItem(id);
    }

    return (
        <div className="w-100 text-white p-3 topbar ">
            <Menu className="d-md-none menu" size={20} onClick={() => setIsSidebarOpen(true)} />
            <div className='dropdown'>
                <div className='dropdown-header ' onClick={toggleDropdown}>
                    {selectedItem ? items.find(item => item.id == selectedItem).label : "Select your Chat"}
                    <i className={`fa fa-chevron-right icon ${isOpen && "open"}`}></i>
                </div>
                <div className={`dropdown-body ${isOpen && 'open'}`}>
                    {items.map(item => (
                        <div className="dropdown-item" onClick={e => handleItemClick(e.target.id)} id={item.id}>
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