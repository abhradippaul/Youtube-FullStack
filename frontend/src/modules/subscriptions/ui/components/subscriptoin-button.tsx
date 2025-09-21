import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubscriptionButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSubscribed: boolean;
  className?: string;
}

function SubscriptionButton({
  disabled,
  isSubscribed,
  onClick,
  className,
}: SubscriptionButtonProps) {
  return (
    <Button
      variant={isSubscribed ? "secondary" : "default"}
      className={cn("rounded-full", className)}
      onClick={onClick}
      disabled={disabled}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
}

export default SubscriptionButton;
