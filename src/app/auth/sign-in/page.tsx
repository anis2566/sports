import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignInForm } from "@/features/auth/components/sign-in-form";

export const metadata: Metadata = {
    title: "TomarSports | Sign In",
    description: "Sign in to your account",
}

const SignIn = async () => {
    const session = await auth();

    if (session?.user) {
        return redirect("/");
    }

    return <SignInForm />

}

export default SignIn