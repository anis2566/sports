import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OrderStatProps {
    title: string
    value: number;
    icon: LucideIcon;
    className?: string;
}

export const OrderStat = ({ title, value, icon: Icon, className }: OrderStatProps) => {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="flex items-center gap-x-3 p-3">
                    <div className={cn("w-12 h-12 rounded-full bg-primary dark:bg-slate-800 flex items-center justify-center flex-shrink-0", className)}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-muted-foreground text-normal truncate">{title}</p>
                        <p className="text-xl font-bold text-primary">{value}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}