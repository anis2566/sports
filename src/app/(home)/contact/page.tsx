import { Metadata } from "next";
import { ContactForm } from "@/features/home/contact/components/contact-form";

export const metadata: Metadata = {
    title: "TomarSports | Contact",
    description: "Contact page.",
};

const Contact = () => {
    return <ContactForm />
}

export default Contact