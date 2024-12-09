import { Metadata } from "next"
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const metadata: Metadata = {
    title: "TomarSports | Sign Up",
    description: "Create your account"
}

const SignUp = async () => {
    const session = await auth();

    if (session?.user) {
        return redirect("/");
    }

    return <SignUpForm />

}

export default SignUp;