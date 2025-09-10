import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import SearchInput from "./search-input";
import AuthButton from "@/modules/auth/ui/components/auth-button";

function HomeNavbar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center shrink-0">
          <SidebarTrigger className="cursor-pointer" />
          <Link href="/">
            <div className="p-4 flex items-center gap-2">
              <Image src="/logo.svg" height={32} width={32} alt="logo" />
              <p className="text-xl font-semibold tracking-tight">Youtube</p>
            </div>
          </Link>
        </div>
        <div className="flex-1 flex justify-center max-w-[720px] mx-auto">
          <SearchInput />
        </div>
        <div className="shrink-0 items-center flex gap-4">
          <AuthButton />
        </div>
      </div>
    </div>
  );
}

export default HomeNavbar;
