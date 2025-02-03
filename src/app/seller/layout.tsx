import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/server/action";
import { SellerLayout } from "@/features/seller/components/seller-layout";
import { db } from "@/lib/db";
import { STATUS } from "@/constant";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getCurrent();

    if (!session || !session.userId) {
        return redirect("/");
    }

    const seller = await db.seller.findUnique({
        where: {
            userId: session.userId
        }
    })

    if (!seller) {
        return redirect("/");
    }

    return <SellerLayout role={session.role} status={seller.status as STATUS}>{children}</SellerLayout>;
}

export default Layout;