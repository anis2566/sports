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
