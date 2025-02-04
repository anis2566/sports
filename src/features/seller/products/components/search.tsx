"use client"

import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import queryString from "query-string";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

export const Search = () => {
    const [search, setSearch] = useState("");

    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const url = queryString.stringifyUrl({
            url: "/seller/marketplace",
            query: { query: search }
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    }

    const handleClear = () => {
        setSearch("");
        router.push("/seller/marketplace");
    }

    return (
        <form className="w-full" onSubmit={handleSearch}>
            <div className="flex items-center gap-x-2 relative w-full max-w-[500px] mx-auto">
                <Input
                    placeholder="Search by product name, category, etc."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 placeholder:text-xs"
                />
                <Button type="button" variant="ghost" size="sm" className={cn("absolute right-8", !search && "hidden")} onClick={handleClear}>
                    <XIcon className="w-4 h-4 text-red-500" />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="absolute right-0">
                    <SearchIcon className="w-4 h-4" />
                </Button>
            </div>
        </form>
    )
}