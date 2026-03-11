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
  "Tip Dist."
] as const;

export type AccessRuleModule = typeof ACCESS_RULE_MODULES[number];

export const getUserModules = (user?: User): string[] => {
  if (!user) return [];

  const modulesFromRoles = user.user_role?.roles || [];
  const modules = [...modulesFromRoles, ...(user.roles || [])];

  return [...new Set(modules)];
};
