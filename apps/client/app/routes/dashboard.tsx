import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import BillingPortal from "~/components/billing-portal";
import { Separator } from "~/components/ui/separator";
import { subscription } from "~/utils/auth";
import { format } from "date-fns";
import type { Subscription } from "@better-auth/stripe";
import { useQuery } from "@tanstack/react-query";

export default function SubscriptionPage() {

    const { data: subscriptions, isLoading } = useQuery({
        queryKey: ['subscriptions'],
        queryFn: async () => {
            const { data: subs } = await subscription.list();

            if (!subs) {
                throw new Error("No subscriptions found");
            }

            return subs;
        }
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500">
                Chargement des abonnements...
            </div>
        );
    }

    // On sélectionne l’abonnement actif / trialing en priorité
    const activeSub = subscriptions?.find(
        (s) => s.status === "active" || s.status === "trialing"
    );

    return (
        <div className=" bg-gray-50 py-12 px-6 text-gray-900">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Titre */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Mon abonnement
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Gérez votre plan et vos informations de facturation.
                    </p>
                </div>

                <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Détails de l’abonnement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-gray-700">
                        {activeSub ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-medium capitalize">
                                        Plan actuel : {activeSub.plan}
                                    </p>
                                    <Badge
                                        className={
                                            activeSub.status === "active" || activeSub.status === "trialing"
                                                ? "bg-green-100 text-green-700"
                                                : activeSub.status === "canceled"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-gray-100 text-gray-700"
                                        }
                                    >
                                        {activeSub.status}
                                    </Badge>
                                </div>

                                <div className="text-sm space-y-1">
                                    {activeSub.trialEnd && (
                                        <p>
                                            Période d’essai jusqu’au{" "}
                                            {format(new Date(activeSub.trialEnd), "dd MMM yyyy")}
                                        </p>
                                    )}
                                    {activeSub.periodStart && activeSub.periodEnd && (
                                        <p>
                                            Cycle actuel :{" "}
                                            {format(new Date(activeSub.periodStart), "dd MMM")} →{" "}
                                            {format(new Date(activeSub.periodEnd), "dd MMM yyyy")}
                                        </p>
                                    )}
                                    {activeSub.cancelAtPeriodEnd && (
                                        <p className="text-red-600 font-medium">
                                            L’abonnement sera annulé à la fin de la période en cours.
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-6 space-y-4">
                                <p className="text-gray-600">
                                    Vous n’avez pas encore d’abonnement actif.
                                </p>
                                <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white">
                                    <a href="/plans">Découvrir nos plans</a>
                                </Button>
                            </div>
                        )}

                        <Separator className="my-6" />

                        <div className="text-center">
                            <BillingPortal returnPath="/dashboard" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
