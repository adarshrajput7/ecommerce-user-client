import { useEffect } from "react";
import Lenis from "lenis";

const LenisProvider = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5, // Reduced duration (1.2 -> 0.8) for snappy response
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth, exponential deceleration curve
      smoothWheel: true,
      wheelMultiplier: 1.8, // Increased wheel multiplier (0.9 -> 1.2) for fast scrolling
      touchMultiplier: 1.5, // Faster responsiveness on mobile/touch screens
      infinite: false,
    });

     window.lenis = lenis;

    let rafId;

    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return children;
};

export default LenisProvider;
