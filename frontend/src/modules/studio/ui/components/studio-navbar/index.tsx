import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import AuthButton from "@/modules/auth/ui/components/auth-button";
import StudioUploadModal from "../studio-upload-modal";

function StudioNavbar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50 border-b shadow-md">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center shrink-0">
          <SidebarTrigger className="cursor-pointer" />
          <Link href="/studio">
            <div className="p-4 flex items-center gap-2">
              <Image src="/logo.svg" height={32} width={32} alt="logo" />
              <p className="text-xl font-semibold tracking-tight">Studio</p>
            </div>
          </Link>
        </div>
        <div className="flex-1"></div>
        <div className="shrink-0 items-center flex gap-4">
          <StudioUploadModal />
          <AuthButton />
        </div>
      </div>
    </div>
  );
}

export default StudioNavbar;
