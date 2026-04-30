// resources/js/Components/ui/Button.jsx
import React, { forwardRef } from "react";
import { Link } from "@inertiajs/react";

const styles = {
  primary:       "bg-primary-700 hover:bg-primary-800 text-white shadow",
  outline:       "border border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white",
  light:         "bg-white text-primary-700 shadow hover:bg-primary-50",
  "outline-light":"border border-white text-white hover:bg-white hover:text-primary-700",
};

const Button = forwardRef(
  (
    {
      href = "#",
      children,
      variant = "primary",          // primary | outline | light | outline-light
      as = "link",                  // "link" | "button"
      className = "",
      ...rest
    },
    ref
  ) => {
    const classes = `inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition ${styles[variant]} ${className}`;

    if (as === "button") {
      return (
        <button ref={ref} className={classes} {...rest}>
          {children}
        </button>
      );
    }

    // default: Link
    return (
      <Link ref={ref} href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
);

export default Button;
