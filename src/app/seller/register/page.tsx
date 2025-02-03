import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/server/action';
import { RegisterForm } from '@/features/seller/register/components/register-form';
import { ROLE } from '@/constant';

const SellerRegister = async () => {
    const session = await getCurrent();

    if (session?.role === ROLE.Seller) {
        return redirect("/");
    }

    return (
        <div className="flex items-center justify-center min-h-screen py-10 px-3">
            <RegisterForm />
        </div>
    );
}

export default SellerRegister;