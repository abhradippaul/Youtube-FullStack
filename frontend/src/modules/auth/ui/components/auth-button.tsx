import { Button } from "@/components/ui/button";
import { UserCircleIcon } from "lucide-react";

function AuthButton() {
  return (
    <Button
      variant="outline"
      className="px-4 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/200 rounded-full shadow-none cursor-pointer [&_svg]:size-5"
    >
      <UserCircleIcon />
      Sign in
    </Button>
  );
}

export default AuthButton;
