"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function BackButton() {
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            className="gap-2 mb-4 hover:bg-transparent p-0"
            onClick={() => router.back()}
        >
            <ArrowRight size={16} /> العودة
        </Button>
    );
}
