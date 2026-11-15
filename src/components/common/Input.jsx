import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

/**
 * Text field (also renders a <textarea> with `as="textarea"`).
 * Works with react-hook-form's `register()` spread — the ref/name/onChange wiring is untouched.
 */
const Input = forwardRef(function Input({ label, error, icon, type = "text", className, hint, as = "input", ...rest }, ref) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (show ? "text" : "password") : type;
  const Field = as === "textarea" ? "textarea" : "input";
  const id = rest.id || rest.name;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-ink-2 mb-1.5" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-4 transition-colors group-focus-within:text-accent-hi">
            {icon}
          </span>
        )}
        <Field
          ref={ref}
          {...(Field === "input" ? { type: resolvedType } : { rows: 4 })}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={clsx(
            "w-full bg-surface/70 border border-line rounded-xl py-2.5 text-sm text-ink",
            "placeholder:text-ink-4 outline-none transition-[border-color,box-shadow,background-color] duration-200",
            "hover:border-ink-4/60 focus:border-accent focus:bg-surface focus:ring-4 focus:ring-accent/15",
            icon ? "pl-10 pr-4" : "px-4",
            isPassword && "pr-11",
            error && "border-danger focus:border-danger focus:ring-danger/15 animate-shake",
            className,
          )}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-4 hover:text-ink transition-colors"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
      {hint && !error && <p className="mt-1.5 text-xs text-ink-4">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
