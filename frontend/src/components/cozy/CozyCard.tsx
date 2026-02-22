"use client";

import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

const variants = {
  form: "rounded-2xl bg-warm-white p-6 shadow-md sm:p-8",
  large: "rounded-2xl bg-warm-white p-6 shadow-lg sm:p-8 md:p-12",
  item: "rounded-xl bg-warm-white p-4 shadow-sm hover:shadow-md",
  hero: "rounded-2xl bg-warm-white p-8 shadow-md sm:p-12",
} as const;

type Variant = keyof typeof variants;

const defaultAnimation = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeInOut" as const },
};

type CozyCardProps = {
  variant?: Variant;
  animated?: boolean;
} & HTMLMotionProps<"div">;

const CozyCard = forwardRef<HTMLDivElement, CozyCardProps>(
  ({ variant = "form", animated = false, className, children, ...rest }, ref) => {
    const classes =
      `${variants[variant]} ${className ?? ""}`.trim();

    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={classes}
          {...defaultAnimation}
          {...rest}
        >
          {children}
        </motion.div>
      );
    }

    // Static card — strip motion-specific props
    const {
      initial,
      animate: _animate,
      exit,
      transition,
      onAnimationComplete,
      whileHover,
      whileTap,
      whileInView,
      ...htmlProps
    } = rest;

    return (
      <div
        ref={ref}
        className={classes}
        {...(htmlProps as HTMLAttributes<HTMLDivElement>)}
      >
        {children as ReactNode}
      </div>
    );
  }
);

CozyCard.displayName = "CozyCard";
export default CozyCard;
