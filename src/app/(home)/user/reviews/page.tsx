import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { getCurrent } from '@/features/auth/server/action';
import { ReviewList } from '@/features/home/user/reviews/components/review-list';
import { NotReviewList } from '@/features/home/user/reviews/components/not-review-list';

export const metadata: Metadata = {
    title: "TomarSports | Reviews",
    description: "Reviews page.",
};

const Reviews = async () => {
    const user = await getCurrent();

    if (!user) {
        return redirect('/');
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>Your reviews on books.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="not-reviewed" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="not-reviewed">Not Reviewed</TabsTrigger>
                        <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
                    </TabsList>
                    <TabsContent value="not-reviewed">
                        <NotReviewList />
                    </TabsContent>
                    <TabsContent value="reviewed">
                        <ReviewList />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

export default Reviews