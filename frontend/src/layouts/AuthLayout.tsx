import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
      <Outlet />
    </div>
  );
}
