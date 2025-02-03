import { Menu } from "lucide-react"

const Topbar = ({ setIsSidebarOpen }) => {
    return (
        <div className="w-100 text-white p-3 topbar">
            <Menu className="d-md-none menu" size={20} onClick={() => setIsSidebarOpen(true)} />
        </div>
    )
}

export default Topbar