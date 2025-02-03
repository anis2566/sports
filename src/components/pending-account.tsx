"use client"

import { Clock } from "lucide-react"
import Link from "next/link"

import { Button } from "./ui/button"

export const PendingAccount = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen px-3">
            <div className="bg-white rounded-xl border border-primary max-w-lg w-full p-8">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 animate-spin">
                            <div className="h-16 w-16 rounded-full border-4 border-amber-200 border-t-amber-500"></div>
                        </div>
                        <div className="relative z-10 text-amber-500 flex items-center justify-center h-16 w-16">
                            <Clock size={32} />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Account Under Review
                    </h1>
                    <p className="text-gray-600 max-w-md">
                        We are currently reviewing your account to ensure everything meets our security standards.
                    </p>
                </div>
                <Button className="w-full" asChild>
                    <Link href="/">
                        Back to Home
                    </Link>
                </Button>
            </div>
        </div>
    )
}