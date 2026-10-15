import ProfileMenu from "./ProfileMenu";

export default function Topbar() {
  return (
    <div className="h-14 border-b border-[#2f2f2f] flex items-center justify-end px-6">
      <ProfileMenu />
    </div>
  );
}
