import { Protected } from "~/components/guards/protected";
import type { Route } from "./+types/pricing";
import { Navigate, redirect } from "react-router";
import { useEffect } from "react";
import { auth, useSession } from "~/utils/auth";
import Stripe from "stripe";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Pricing" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Home() {
    return (
        <>
            <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
            <stripe-pricing-table pricing-table-id="prctbl_1S92tCRvGJ6lPiv4Iogwttsp"
                publishable-key="pk_test_51S8i7QRvGJ6lPiv4gXbPbgR96K8bzsEgiT9RqqQDawq9uUwee44jDxVUS0gnbKwrPElMUjGRbOf52lDVMTMPaDoD00PW9qyd3a">
            </stripe-pricing-table>
        </>
    )


}
