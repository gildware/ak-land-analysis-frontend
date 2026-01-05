import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import SidebarDrawer from "../components/SidebarDrawer";
import MapPanel from "../components/MapPanel";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 gap-6 overflow-hidden p-4">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Map */}
        <div className="h-full flex-1">
          <MapPanel />
        </div>
      </div>

      <Footer />

      {/* Tablet / Mobile sidebar */}
      <SidebarDrawer open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}
