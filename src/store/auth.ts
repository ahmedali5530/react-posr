import { atomWithStorage } from "jotai/utils";

export interface AuthStateInterface {
  token?: string
}

export const authState = atomWithStorage<AuthStateInterface>(
  'auth-state',
  {
    
  }
);
