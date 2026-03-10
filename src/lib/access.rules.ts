import { User } from "@/api/model/user.ts";

export const ACCESS_RULE_MODULES = [
  "Menu",
  "Orders",
  "Reports",
  "Closing",
  "Kitchen",
  "Delivery",
  "Admin",
  "Riders",
] as const;

export type AccessRuleModule = typeof ACCESS_RULE_MODULES[number];

export const getUserModules = (user?: User): string[] => {
  if (!user) return [];

  const modulesFromRoles = user.user_roles?.roles || [];
  const modules = [...modulesFromRoles, ...(user.roles || [])];

  return [...new Set(modules)];
};
