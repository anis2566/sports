import { Coins, Play } from "lucide-react"
import Image from "next/image"

export const DeliveryBanner = () => {
    return (
        <div className="px-3 md:px-0 py-4 hidden md:grid md:grid-cols-3 gap-6">
            <div className="w-full border border-primary rounded-md p-3 py-4 flex items-center justify-center gap-x-3">
                <p className="text-base font-semibold text-muted-foreground">সমগ্র বাংলাদেশে হোম ডেলিভারি</p>
                <Image src="/cod.jpg" alt="delivery" width={24} height={24} />
            </div>
            <div className="w-full border border-primary rounded-md p-3 py-4 flex items-center justify-center gap-x-3">
                <p className="text-base font-semibold text-muted-foreground">কীভাবে অর্ডার করবেন</p>
                <Play className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="w-full border border-primary rounded-md p-3 py-4 flex items-center justify-center gap-x-3">
                <p className="text-base font-semibold text-muted-foreground">পণ্য কিনে পয়েন্টস জিতুন</p>
                <Coins className="w-6 h-6 text-muted-foreground" />
            </div>
        </div>
    )
}