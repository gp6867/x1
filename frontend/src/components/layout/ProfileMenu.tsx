import { useState } from "react";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-2 hover:bg-[#2a2a2a] rounded"
      >
        Profile
      </button>

      {open && (
        <div className="absolute bottom-12 left-0 w-56 bg-[#202020] rounded-lg shadow-lg p-2 space-y-1">

          <button className="w-full text-left p-2 hover:bg-[#2a2a2a] rounded">
            Login
          </button>

          <button className="w-full text-left p-2 hover:bg-[#2a2a2a] rounded">
            Register
          </button>

          <button className="w-full text-left p-2 hover:bg-[#2a2a2a] rounded">
            Login with Google
          </button>

        </div>
      )}
    </div>
  );
}
