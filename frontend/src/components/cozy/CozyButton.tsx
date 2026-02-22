import { type ComponentPropsWithoutRef } from "react";
import Link from "next/link";

const variants = {
  primary:
    "bg-terracotta text-warm-white hover:bg-terracotta/90",
  secondary:
    "border-2 border-moss text-moss hover:bg-moss/10",
  ghost:
    "border-2 border-wood/30 text-foreground/70 hover:border-terracotta/50 hover:bg-cream/50",
  danger:
    "text-red-500 hover:bg-red-50",
} as const;

const baseClass =
  "rounded-xl px-6 py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

type Variant = keyof typeof variants;

type ButtonAsButton = {
  as?: "button";
  href?: never;
} & ComponentPropsWithoutRef<"button">;

type ButtonAsLink = {
  as: "link";
  href: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href">;

type ButtonAsAnchor = {
  as: "a";
  href: string;
} & ComponentPropsWithoutRef<"a">;

type CozyButtonProps = (ButtonAsButton | ButtonAsLink | ButtonAsAnchor) & {
  variant?: Variant;
  fullWidth?: boolean;
};

export default function CozyButton(props: CozyButtonProps) {
  const {
    as = "button",
    variant = "primary",
    fullWidth = false,
    className,
    ...rest
  } = props;

  const classes =
    `${baseClass} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className ?? ""}`.trim();

  if (as === "link") {
    const { href, ...linkRest } = rest as ButtonAsLink & { href: string };
    return <Link href={href} className={classes} {...linkRest} />;
  }

  if (as === "a") {
    const { href, ...anchorRest } = rest as ButtonAsAnchor & { href: string };
    return <a href={href} className={classes} {...anchorRest} />;
  }

  return <button className={classes} {...(rest as ComponentPropsWithoutRef<"button">)} />;
}
