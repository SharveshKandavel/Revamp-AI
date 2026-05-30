import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useMobileDevice } from "@/hooks/useMobile";
import { ImpactStyle } from "@capacitor/haptics";
import { cn } from "@/lib/utils";

interface TouchOptimizedButtonProps extends ButtonProps {
  hapticFeedback?: boolean;
  hapticStyle?: ImpactStyle;
}

const TouchOptimizedButton: React.FC<TouchOptimizedButtonProps> = ({
  children,
  className,
  onClick,
  hapticFeedback = true,
  hapticStyle = ImpactStyle.Light,
  ...props
}) => {
  const { triggerHaptic, isMobile } = useMobileDevice();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hapticFeedback && isMobile) {
      await triggerHaptic(hapticStyle);
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      className={cn(
        // Enhanced touch targets for mobile
        "min-h-[44px] min-w-[44px]",
        // Better active states for touch
        "active:scale-[0.98] active:transition-transform active:duration-75",
        // Improved focus states
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </Button>
  );
};

export default TouchOptimizedButton;