import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/server/action';
import { OrderList } from '@/features/home/user/orders/components/order-list';

export const metadata: Metadata = {
    title: "TomarSports | Orders",
    description: "Orders page.",
};

const Orders = async () => {
    const user = await getCurrent();

    if (!user) {
        return redirect('/');
    }

    return <OrderList userId={user.userId} />
}

export default Orders