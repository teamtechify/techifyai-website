"use client";

import {
  KeyframeOptions,
  animate,
  useInView,
  useIsomorphicLayoutEffect,
} from "framer-motion";
import { useRef } from "react";
import { FormatNumberWithCommasSimple } from "../graphs";

type CounterProps = {
  from: number;
  to: number;
  animationOptions?: KeyframeOptions;
  endChar?: string;
  duration?: number;
  className?: string; // Add className as an optional prop
};

export const Counter = ({
  from,
  to,
  animationOptions,
  endChar,
  duration = 3,
  className, // Accept className prop
}: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) return;
    if (!inView) return;

    // Set initial value
    element.textContent = `${FormatNumberWithCommasSimple(from)}${endChar || ""}`;

    // If reduced motion is enabled in system's preferences
    if (window.matchMedia("(prefers-reduced-motion)").matches) {
      element.textContent = `${FormatNumberWithCommasSimple(to)}${endChar || ""}`;
      return;
    }

    const controls = animate(from, to, {
      duration: duration,
      ease: "easeOut",
      ...animationOptions,
      onUpdate(value) {
        element.textContent = `${FormatNumberWithCommasSimple(value)}${endChar || ""}`;
      },
    });

    // Cancel on unmount
    return () => {
      controls.stop();
    };
  }, [ref, inView, from, to, endChar, duration, animationOptions]);

  return <span ref={ref} className={className} />;
};
