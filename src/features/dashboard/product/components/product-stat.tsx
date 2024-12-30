import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { LucideIcon } from "lucide-react"

interface ProductStatProps {
    isLoading: boolean
    value: number
    icon: LucideIcon
    title: string
}

export const ProductStat = ({ isLoading, value, icon: Icon, title }: ProductStatProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {
                    isLoading ? (
                        <Skeleton className="h-[28px] w-2/3" />
                    ) : (
                        <div className="text-xl font-bold">{value}</div>
                    )
                }
            </CardContent>
        </Card>
    )
}