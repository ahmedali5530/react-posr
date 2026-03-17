import { User } from "@/api/model/user.ts";

export const ACCESS_RULE_MODULES: Record<string, AccessRuleModule> = {
  "Menu": {
    label: "Menu",
    children: [] as string[]
  },
  "Orders": {
    label: "Orders", 
    children: [] as string[]
  },
  "Reports": {
    label: "Reports",
    children: ["Sales Reports", "Audit Reports", "Inventory Reports", "Financial Reports"] as string[]
  },
  "Closing": {
    label: "Closing",
    children: [] as string[]
  },
  "Kitchen": {
    label: "Kitchen",
    children: ["Order Display", "Kitchen Orders", "Preparation"] as string[]
  },
  "Delivery": {
    label: "Delivery",
    children: ["Order Management", "Driver Management", "Delivery Tracking"] as string[]
  },
  "Admin": {
    label: "Administration",
    children: ["User Management", "System Settings", "Database Management"] as string[]
  },
  "Riders": {
    label: "Riders",
    children: ["Rider Management", "Schedule Management", "Performance Reports"] as string[]
  },
  "Tip Dist.": {
    label: "Tip Distribution",
    children: ["Distribution Reports", "Tip Calculation", "Payout Management"] as string[]
  }
};

export type AccessRuleModule = {
  label: string;
  children: string[];
};

export const getUserModules = (user?: User): string[] => {
  if (!user) return [];

  const modulesFromRoles = user.user_role?.roles || [];
  const modules = [...modulesFromRoles, ...(user.roles || [])];

  return [...new Set(modules)];
};
