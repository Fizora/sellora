import { ReactNode } from "react";

interface ParafProps {
  children: ReactNode;
  className?: string;
}

export default function Paraf({ children, className = "" }: ParafProps) {
  return (
    <p
      className={`text-gray-600 dark:text-gray-300 leading-relaxed ${className}`}
    >
      {children}
    </p>
  );
}
