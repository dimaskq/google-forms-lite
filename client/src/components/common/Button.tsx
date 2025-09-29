import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({ variant = "primary", ...props }: Props) {
  const base =
    "px-4 py-2 rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-purple-600 text-white hover:bg-purple-700"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <button
      {...props}
      className={`${base} ${styles} ${props.className || ""}`}
    />
  );
}
