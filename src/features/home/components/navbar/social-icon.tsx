import Link from "next/link"

import { Button } from "@/components/ui/button"

interface SocialIconProps {
    icon: React.ReactNode
    href: string
}

export const SocialIcon = ({ icon, href }: SocialIconProps) => {
    return (
        <Button asChild variant="ghost" size="icon">
            <Link href={href} target="_blank" rel="noopener noreferrer">
                {icon}
            </Link>
        </Button>
    )
}