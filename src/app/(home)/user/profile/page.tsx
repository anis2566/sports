import { redirect } from 'next/navigation';
import { Metadata } from 'next';

import { PersonalInfoForm } from '@/features/home/user/profile/components/personal-info-form';
import { getCurrent } from '@/features/auth/server/action';
import { db } from '@/lib/db';
import { AccountForm } from '@/features/home/user/profile/components/account-form';
import { AvatarForm } from '@/features/home/user/profile/components/avatar-form';
import { PasswordForm } from '@/features/home/user/profile/components/password-form';

export const metadata: Metadata = {
  title: "TomarSports | Profile",
  description: "Profile page.",
};


const Profile = async () => {
    const user = await getCurrent();
    
    if (!user) {
        return redirect('/');
    }

    const dbUser = await db.user.findUnique({
        where: {
            id: user.userId
        }
    })

    if (!dbUser) {
        return redirect('/');
    }

  return (
    <div className="space-y-5">
      <PersonalInfoForm user={dbUser} />
      <AccountForm user={dbUser} />
      <AvatarForm user={dbUser} />
      <PasswordForm userId={user.userId} />
    </div>
  )
}

export default Profile