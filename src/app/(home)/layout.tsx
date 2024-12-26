import { Separator } from "@/components/ui/separator"

import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { Navbar } from "@/features/home/components/navbar"

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full max-w-screen-xl mx-auto flex flex-col relative">
            <Header />
            {/* <MobileHeader /> */}
            <Navbar />
            <div className="mt-28 md:mt-0">
                {children}
            </div>
            <Separator />
            <Footer />
        </div>
    )
}

export default HomeLayout