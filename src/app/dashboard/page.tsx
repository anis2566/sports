import { Metadata } from "next";

import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { DashboardPage } from "@/features/dashboard/components/dashboard-page";

export const metadata: Metadata = {
    title: "TomarSports | Dashboard",
    description: "TomarSports Dashboard",
};

const Dashboard = () => {
    return (
        <ContentLayout title="Dashboard">
            <DashboardPage />
        </ContentLayout>
    )
};

export default Dashboard;