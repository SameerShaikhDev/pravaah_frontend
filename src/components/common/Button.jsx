import React from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

const VARIANTS = {
  primary: "btn-sheen bg-action text-white shadow-glow hover:brightness-110 hover:-translate-y-px",
  secondary: "glass text-ink hover:border-accent/50 hover:bg-surface-2",
  ghost: "bg-transparent text-ink-2 hover:text-ink hover:bg-ink/5",
  danger: "bg-danger text-white hover:brightness-110 shadow-[0_8px_24px_-8px_rgb(var(--danger)/0.7)]",
  outline: "border border-accent/60 text-accent-hi hover:bg-accent/10 hover:border-accent",
};

const SIZES = {
  sm: "px-3.5 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-xl",
};

/** Shared button. Pass `isLoading` while awaiting an API call — it disables the button and shows a spinner. */
const Button = React.forwardRef(function Button(
  { children, variant = "primary", size = "md", isLoading, disabled, icon, iconPosition = "left", className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={clsx(
        "group inline-flex items-center justify-center gap-2 font-medium select-none",
        "transition-[transform,filter,background-color,border-color,box-shadow] duration-200 ease-snap",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 active:scale-[0.97] active:translate-y-0",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {isLoading ? <Loader2 className="animate-spin" size={16} /> : icon && iconPosition === "left" && icon}
      {children}
      {!isLoading && icon && iconPosition === "right" && (
        <span className="transition-transform duration-200 ease-snap group-hover:translate-x-0.5">{icon}</span>
      )}
    </button>
  );
});

export default Button;
