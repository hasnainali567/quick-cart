import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type TopProgressBarProps = {
  /** Pass the isPending state from useSession */
  isPending: boolean;
  className?: string;
};

/**
 * YouTube-style top progress bar using the shadcn Progress component.
 *
 * - Uses requestAnimationFrame + elapsed time for smooth, realistic progress
 * - Approaches 90% asymptotically while loading (so it never "gets stuck")
 * - Shoots to 100% and fades out when isPending becomes false
 *
 * Formula: progress = 90 * (1 - e^(-elapsed / speed))
 * This matches actual network feel — fast connections complete quickly,
 * slow ones creep toward 90% until the real response arrives.
 */
const TopProgressBar = ({ isPending, className }: TopProgressBarProps) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  // While pending: drive progress with elapsed time via rAF
  useEffect(() => {
    if (!isPending) return;

    // Reset on each new pending session
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(0);
    setVisible(true);
    startTimeRef.current = performance.now();

    const tick = () => {
      const elapsed = performance.now() - (startTimeRef.current ?? 0);
      // Asymptotic curve — naturally feels like real network timing
      // Adjusting the divisor (2500) changes perceived speed
      const next = 90 * (1 - Math.exp(-elapsed / 2500));
      setProgress(next);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [isPending]);

  // When done: complete to 100%, then fade out
  useEffect(() => {
    if (isPending) return;

    cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(100);

    const hideTimer = setTimeout(() => setVisible(false), 400); // wait for fill animation
    return () => clearTimeout(hideTimer);
  }, [isPending]);

  if (!visible) return null;

  return (
    <Progress
      value={progress}
      className={cn(
        "fixed top-0 left-0 right-0 z-[9999] h-[2px] rounded-none bg-transparent",
        // Fade out when complete
        !isPending && "opacity-0 transition-opacity duration-300",
        className,
      )}
    />
  );
};

export default TopProgressBar;
