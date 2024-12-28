import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { SidebarNavs } from "@/features/home/user/components/sidebar-navs";
import { Separator } from "@/components/ui/separator";
import { JWTPayload } from "@/lib/session-middleware";

interface SidebarProps {
    user: JWTPayload;
}

export const Sidebar = ({ user }: SidebarProps) => {
    return (
        <Card>
            <CardContent className="space-y-4 p-4">
                <div>
                    <div className="mx-auto flex h-[80px] w-[80px] items-center justify-center rounded-full border-2 border-dotted">
                        <Image
                            src={user.image || "/patient.png"}
                            alt={user.name || ""}
                            width={80}
                            height={80}
                            className="h-full w-full rounded-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col items-center gap-y-1">
                        <h1 className="font-semibold">{user.name}</h1>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                </div>
                <Separator />
                <SidebarNavs />
            </CardContent>
        </Card>
    )
}