import React from 'react';
import { useSecurity } from '@/hooks/useSecurity';

interface ProtectedLinkProps {
  to: string;
  children: React.ReactNode;
  authType?: 'pin' | 'password' | 'biometric' | 'admin-code';
  description?: string;
  className?: string;
  onClick?: () => void;
}

export const ProtectedLink: React.FC<ProtectedLinkProps> = ({
  to,
  children,
  authType = 'pin',
  description,
  className,
  onClick
}) => {
  const { protectAction } = useSecurity();

  const handleClick = () => {
    protectAction(() => {
      // Navigate to the route
      window.location.href = to;
      onClick?.();
    }, {
      description: description || `Authenticate to access this page`,
      authType
    });
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
};
