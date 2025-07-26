"use client";

import dynamic from "next/dynamic";

// Import PromoPopup with ssr: false trong client component
const PromoPopup = dynamic(() => import("@/components/PromoPopup"), {
    ssr: false
});

export default function ClientOnlyPromoPopup() {
    return <PromoPopup />;
}
