import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children : ReactNode;
}

export default function AuthLayout({ children } : AuthLayoutProps) : JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col px-4">
      <div className="w-full max-w-xs">{children}</div>
    </div>
  );
}
