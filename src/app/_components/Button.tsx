import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  type?: "button" | "submit";
  href?: string;
  form?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "danger" | "secondary";
  className?: string;
};

export function Button({
  children,
  type = "button",
  href,
  form,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed";

  const styles = {
    primary: "text-white bg-blue-700 hover:bg-blue-800",
    danger: "text-white bg-red-600 hover:bg-red-700",
    secondary: "text-gray-900 bg-transparent border border-gray-300 hover:bg-gray-100",
  };

  const buttonClassName = `${base} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={buttonClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      className={buttonClassName}
    >
      {children}
    </button>
  );
}