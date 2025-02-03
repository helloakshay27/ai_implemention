import { useState } from "react";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="d-flex w-100">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <main className="w-100 main">
                <Topbar setIsSidebarOpen={setIsSidebarOpen} />
                {children}
            </main>
        </div>
    );
};

export default Layout;
