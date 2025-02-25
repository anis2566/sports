import {
    LayoutGrid,
    LucideIcon,
    List,
    Layers3,
    MessageCircleQuestion,
    PlusCircle,
    MessageCircleWarning,
    CalendarArrowUp,
    GalleryVertical,
    Users,
    Radio,
    UserCheck,
    Ribbon,
    Package,
    Store,
    ShoppingBag,
} from "lucide-react";

type Submenu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon;
};

type Menu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon;
    submenus: Submenu[];
};

type Group = {
    groupLabel: string;
    menus: Menu[];
};

export function getAdminMenuList(pathname: string): Group[] {
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/dashboard",
                    label: "Dashboard",
                    active: pathname === "/dashboard",
                    icon: LayoutGrid,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Main",
            menus: [
                {
                    href: "",
                    label: "Brand",
                    active: pathname.includes("/dashboard/brand"),
                    icon: Ribbon,
                    submenus: [
                        {
                            href: "/dashboard/brand/new",
                            label: "New",
                            active: pathname === "/dashboard/brand/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/brand",
                            label: "List",
                            active: pathname === "/dashboard/brand" || pathname.split("/").length > 4,
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "category",
                    active: pathname.includes("/dashboard/category"),
                    icon: Layers3,
                    submenus: [
                        {
                            href: "/dashboard/category/new",
                            label: "New",
                            active: pathname === "/dashboard/category/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/category",
                            label: "List",
                            active: pathname === "/dashboard/category" || pathname.split("/").length > 4,
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Product",
                    active: pathname.includes("/dashboard/product"),
                    icon: Package,
                    submenus: [
                        {
                            href: "/dashboard/product/new",
                            label: "New",
                            active: pathname === "/dashboard/product/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/product",
                            label: "List",
                            active: pathname === "/dashboard/product",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "/dashboard/order",
                    label: "Order",
                    active: pathname.includes("/dashboard/order"),
                    icon: CalendarArrowUp,
                    submenus: [],
                },
                {
                    href: "/dashboard/review",
                    label: "Review",
                    active: pathname.includes("/dashboard/review"),
                    icon: MessageCircleWarning,
                    submenus: [],
                },
                {
                    href: "/dashboard/question",
                    label: "Question",
                    active: pathname.includes("/dashboard/question"),
                    icon: MessageCircleQuestion,
                    submenus: [],
                },
                {
                    href: "",
                    label: "Banner",
                    active: pathname.includes("/dashboard/banner"),
                    icon: GalleryVertical,
                    submenus: [
                        {
                            href: "/dashboard/banner/new",
                            label: "New",
                            active: pathname === "/dashboard/banner/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/banner",
                            label: "List",
                            active: pathname === "/dashboard/banner",
                            icon: List,
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: "Seller",
            menus: [
                {
                    href: "",
                    label: "Seller",
                    active: pathname === "/admin/seller",
                    icon: Users,
                    submenus: [
                        {
                            href: "/dashboard/seller/request",
                            label: "Request",
                            active: pathname === "/dashboard/seller/request",
                            icon: Radio,
                        },
                        {
                            href: "/dashboard/seller",
                            label: "List",
                            active: pathname === "/dashboard/seller",
                            icon: List,
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: "Promotion",
            menus: [
                {
                    href: "/dashboard/subscribers",
                    label: "Subscribers",
                    active: pathname.includes("/dashboard/subscribers"),
                    icon: UserCheck,
                    submenus: [],
                },
            ],
        },
    ];
}

export function getSellerMenuList(pathname: string): Group[] {
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/seller",
                    label: "Dashboard",
                    active: pathname === "/seller",
                    icon: LayoutGrid,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Main",
            menus: [
                {
                    href: "/seller/marketplace",
                    label: "Marketplace",
                    active: pathname.includes("/seller/marketplace"),
                    icon: Store,
                    submenus: [],
                },
                {
                    href: "/seller/orders",
                    label: "Orders",
                    active: pathname.includes("/seller/orders"),
                    icon: ShoppingBag,
                    submenus: [],
                },
                {
                    href: "/seller/support",
                    label: "Support",
                    active: pathname.includes("/seller/support"),
                    icon: MessageCircleQuestion,
                    submenus: [],
                },
            ],
        },
    ];
}