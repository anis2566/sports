import { Metadata } from "next";

import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { DashboardPage } from "@/features/dashboard/components/dashboard-page";
import { db } from "@/lib/db";
import { zones } from "@/test";

export const metadata: Metadata = {
    title: "TomarSports | Dashboard",
    description: "TomarSports Dashboard",
};

const Dashboard = async () => {
    // await db.zone.createMany({
    //     data: zones.map((area) => ({
    //         ...area,
    //         areaId: "67724b24c87229f0b5d18fdf"
    //     }))
    // })
    return (
        <ContentLayout title="Dashboard">
            <DashboardPage />
        </ContentLayout>
    )
};

export default Dashboard;