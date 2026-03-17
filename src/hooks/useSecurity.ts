import { useCallback } from 'react';
import { useSecurityContext, AuthType } from '@/providers/security.provider';
import { nanoid } from 'nanoid';

export interface ProtectedActionOptions {
  description: string;
  authType?: AuthType;
  module?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const useSecurity = () => {
  const { requestSecurity } = useSecurityContext();

  const protectAction = useCallback((
    action: () => void,
    options: ProtectedActionOptions
  ) => {
    const { description, authType = 'pin', module, onSuccess, onCancel } = options;
    
    requestSecurity({
      id: nanoid(),
      description,
      authType,
      module,
      onConfirm: () => {
        action();
        onSuccess?.();
      },
      onCancel,
    });
  }, [requestSecurity]);

  const protectFormSubmit = useCallback((
    submitHandler: (e: React.FormEvent) => void,
    options: ProtectedActionOptions
  ) => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      protectAction(() => submitHandler(e), options);
    };
  }, [protectAction]);

  return {
    protectAction,
    protectFormSubmit,
  };
};
