import React, { useCallback } from 'react';
import { useSecurityContext, AuthType } from '@/providers/security.provider';
import { nanoid } from 'nanoid';
import {toRecordId} from "@/lib/utils.ts";
import {useAtom} from "jotai";
import {appPage} from "@/store/jotai.ts";
import {useDB} from "@/api/db/db.ts";

export interface ProtectedActionOptions {
  description: string;
  authType?: AuthType;
  module?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  onError?: () => void;
  payload?: any
}

export const useSecurity = () => {
  const { requestSecurity } = useSecurityContext();
  const [{user}] = useAtom(appPage);
  const db = useDB();

  const protectAction = useCallback(async (
    action: () => void,
    options: ProtectedActionOptions
  ) => {
    const { description, authType = 'pin', module, onSuccess, onCancel, onError, payload } = options;

    const [userWithModules] = await db.query(`SELECT * FROM ONLY ${toRecordId(user?.id)} FETCH user_role`);
    if(userWithModules?.user_role?.roles.includes(module)){
      action();
      onSuccess?.();
      return;
    }
    
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
      onError,
      payload
    });
  }, [requestSecurity, user?.id]);

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
