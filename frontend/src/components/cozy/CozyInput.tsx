import { type ComponentPropsWithoutRef } from "react";

type InputProps = {
  as?: "input";
  variant?: "default" | "serif";
  label?: string;
} & ComponentPropsWithoutRef<"input">;

type TextareaProps = {
  as: "textarea";
  variant?: "default" | "serif";
  label?: string;
} & ComponentPropsWithoutRef<"textarea">;

type CozyInputProps = InputProps | TextareaProps;

const baseClass =
  "w-full rounded-xl border border-wood/30 bg-cream/50 px-5 py-3 text-foreground placeholder:text-wood/50 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/20 focus:outline-none transition-colors";

export default function CozyInput(props: CozyInputProps) {
  const { as = "input", variant = "default", label, className, ...rest } = props;
  const variantClass = variant === "serif" ? "font-serif text-xl" : "";
  const classes = `${baseClass} ${variantClass} ${className ?? ""}`.trim();

  return (
    <div>
      {label && (
        <label
          htmlFor={rest.id}
          className="mb-2 block text-sm font-medium text-foreground/60"
        >
          {label}
        </label>
      )}
      {as === "textarea" ? (
        <textarea {...(rest as ComponentPropsWithoutRef<"textarea">)} className={classes} />
      ) : (
        <input {...(rest as ComponentPropsWithoutRef<"input">)} className={classes} />
      )}
    </div>
  );
}
