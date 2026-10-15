import Sidebar from "../components/layout/Sidebar";
import { Outlet } from "react-router-dom";

export default function ChatLayout() {
  return (
    <div className="flex h-screen w-screen bg-[#212121] text-white">
      
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT CHAT AREA */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Outlet />
      </div>

    </div>
  );
}
