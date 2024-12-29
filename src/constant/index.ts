import { FilePenLine, MessageCircle, ShoppingBag, Sparkles } from "lucide-react";

import { User } from "lucide-react";

import { LucideIcon } from "lucide-react";

export const AUTH_COOKIE = "access-token"

export enum ROLE {
  User = "User",
  Admin = "Admin",
}

export enum STATUS {
  Pending = "Pending",
  Active = "Active",
  Inactive = "Inactive",
}

export enum CATEGORY_STATUS {
  Active = "Active",
  Inactive = "Inactive",
}


export enum PRODUCT_STATUS {
  Active = "Active",
  Inactive = "Inactive",
}

export enum ORDER_STATUS {
  Pending = "Pending",
  Processing = "Processing",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

export enum PAYMENT_METHOD {
  COD = "COD",
  MOB = "Mobile Banking",
  BANK = "Bank Transfer",
}

export enum PAYMENT_STATUS {
  Pending = "Pending",
  Paid = "Paid",
  Failed = "Failed",
}

export enum GENDER {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export enum GENRE {
  Trending = "Trending",
  ForYou = "For_You",
}

type UserSidebarNavs = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const userSidebarNavs: UserSidebarNavs[] = [
  {
    label: "Profile",
    href: "/user/profile",
    icon: User,
  },
  {
    label: "Orders",
    href: "/user/orders",
    icon: ShoppingBag,
  },
  {
    label: "Reviews",
    href: "/user/reviews",
    icon: FilePenLine,
  },
  {
    label: "Questions",
    href: "/user/questions",
    icon: MessageCircle,
  },
  {
    label: "Points",
    href: "/user/points",
    icon: Sparkles,
  },
];
