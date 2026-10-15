import Sidebar from "./Sidebar";
import Chat from "../../pages/chat/Chat";

export default function ChatLayout() {
  return (
    <div className="flex h-screen bg-[#212121] text-white">
      
      {/* Sidebar */}
      <div className="w-[260px] bg-[#171717] border-r border-[#2a2a2a]">
        <Sidebar />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-3xl flex flex-col h-full">
          <Chat />
        </div>
      </div>

    </div>
  );
}
