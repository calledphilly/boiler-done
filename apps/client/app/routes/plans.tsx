import type { Route } from "./+types/plans";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { Check, Crown, Zap, Star } from "lucide-react";
import { auth, subscription } from "~/utils/auth";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { type StripePlan, type Subscription } from "@better-auth/stripe";
import type Stripe from "stripe";

interface Plan {
    name: string;
    displayName: string;
    description: string | null;
    monthlyPrice: {
        amount: number;
        currency: string;
        priceId: string;
    };
    annualPrice: {
        amount: number;
        currency: string;
        priceId: string;
    };
    limits: {
        projects: number;
    };
    features: { name: string }[];
}

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Plans & Tarifs" },
        { name: "description", content: "Choisissez le plan qui vous convient le mieux." },
    ];
}

export default function Plans() {
    const { data: subscriptions, isLoading } = useQuery<Subscription[]>({
        queryKey: ['subscriptions'],
        queryFn: async () => {
            const { data: subs, error } = await subscription.list();

            if (error) {
                throw new Error("Erreur lors du chargement des abonnements");
            }

            return subs;
        }
    })

    // On sélectionne l’abonnement actif / trialing en priorité
    const activeSub = subscriptions?.find(
        (s) => s.status === "active" || s.status === "trialing"
    );

    const [subscribing, setSubscribing] = useState<string | null>(null);
    const [annual, setAnnual] = useState<boolean>(false);

    const { data: plans } = useQuery({
        queryKey: ['plans'],
        queryFn: async () => {
            const res = await fetch("http://localhost:3000/api/v1/plans");
            if (!res.ok) throw new Error("Erreur lors du chargement des plans");
            const data = await res.json();
            return data.plans
        }
    })

    const subscribe = async (plan: Plan) => {
        try {
            setSubscribing(plan.name);
            await subscription.upgrade({
                annual,
                plan: plan.name,
                successUrl: `${window.location.origin}/dashboard`,
                cancelUrl: `${window.location.origin}/plans`,
            });
            toast.success(`Abonnement ${plan.displayName} activé !`);
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de la souscription.");
        } finally {
            setSubscribing(null);
        }
    };

    const getPlanIcon = (planName: string) => {
        switch (planName) {
            case "basic":
                return <Star className="w-6 h-6 text-blue-500" />;
            case "pro":
                return <Zap className="w-6 h-6 text-purple-500" />;
            case "enterprise":
                return <Crown className="w-6 h-6 text-yellow-500" />;
            default:
                return null;
        }
    };

    const getPrice = (plan: Plan) => {
        const price = annual ? plan.annualPrice : plan.monthlyPrice;
        return {
            amount: annual ? Math.round(price.amount / 12) : price.amount,
            total: price.amount,
            currency: price.currency,
            priceId: price.priceId,
        };
    };

    const getSavings = (plan: Plan) => {
        const monthlyTotal = plan.monthlyPrice.amount * 12;
        const annualTotal = plan.annualPrice.amount;
        const savings = Math.round(((monthlyTotal - annualTotal) / monthlyTotal) * 100);
        return savings > 0 ? savings : 0;
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
                Chargement des plans...
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-50 px-6 py-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Nos Plans & Tarifs
                </h1>
                <p className="text-gray-600 text-lg">
                    Choisissez le plan qui correspond à vos besoins. Changez ou annulez à tout moment.
                </p>

                {/* Toggle Mensuel / Annuel */}
                <div className="flex items-center justify-center gap-4 mt-6 p-4 bg-gray-100 rounded-lg shadow-sm">
                    <span className={`text-sm font-medium ${!annual ? "text-gray-900" : "text-gray-500"}`}>Mensuel</span>
                    <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Toggle billing period" />
                    <span className={`text-sm font-medium ${annual ? "text-gray-900" : "text-gray-500"}`}>Annuel</span>
                </div>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {plans?.map((plan: Plan) => {
                    const isPro = plan.name === "pro";
                    const price = getPrice(plan);
                    const savings = getSavings(plan);
                    const isActivePlan = plan.name === activeSub?.plan;
                    const isSubscribing = subscribing === plan.name;

                    return (
                        <Card
                            key={plan.name}
                            className={`relative flex flex-col justify-between transition-all duration-200 hover:shadow-lg bg-white px-6 py-6 ${isPro ? "border-purple-500 shadow-md ring-2 ring-purple-100" : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            {isPro && (
                                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-purple-600 text-white px-3 py-1 shadow-md">🔥 Plus populaire</Badge>
                                </div>
                            )}

                            <CardHeader className="text-center pb-4">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    {getPlanIcon(plan.name)}
                                    <CardTitle className="text-2xl font-semibold capitalize text-gray-900">{plan.displayName}</CardTitle>
                                </div>
                                {plan.description && <p className="text-sm text-gray-600">{plan.description}</p>}
                            </CardHeader>

                            <CardContent className="text-center">
                                <div className="mb-6">
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-4xl font-bold text-gray-900">${price.amount}</span>
                                        <span className="text-lg text-gray-600">/mois</span>
                                    </div>
                                    {annual && savings > 0 && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 line-through">${plan.monthlyPrice.amount}/mois</p>
                                            <Badge className="bg-green-100 text-green-700 border border-green-200">Économisez {savings}%</Badge>
                                        </div>
                                    )}
                                    {annual && <p className="text-sm text-gray-500 mt-1">${price.total} facturé annuellement</p>}
                                </div>

                                <div className="text-left">
                                    <p className="text-sm font-medium text-gray-900 mb-3">Jusqu'à {plan.limits.projects} projets</p>
                                    <ul className="space-y-2">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>{feature.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>

                            <CardFooter className="pt-6">
                                {isActivePlan ? (
                                    <Button disabled className="w-full bg-gray-400 text-white cursor-default">
                                        Plan actif
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => subscribe(plan)}
                                        disabled={isSubscribing}
                                        className={`w-full ${isPro ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-gray-900 hover:bg-gray-800 text-white"} transition-all`}
                                    >
                                        {isSubscribing ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Souscription...
                                            </div>
                                        ) : (
                                            `Choisir ${plan.displayName}`
                                        )}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {/* FAQ */}
            <div className="max-w-4xl mx-auto mt-16 text-center">
                <div className="bg-white rounded-lg p-8 shadow-md border">
                    <h3 className="text-xl font-semibold mb-6 text-gray-900">Questions fréquentes</h3>
                    <div className="grid gap-6 md:grid-cols-2 text-left">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Puis-je changer de plan ?</h4>
                            <p className="text-sm text-gray-600">
                                Oui, vous pouvez changer de plan à tout moment. Les changements prennent effet immédiatement.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Puis-je annuler ?</h4>
                            <p className="text-sm text-gray-600">
                                Vous pouvez annuler votre abonnement à tout moment. Votre accès restera actif jusqu'à la fin de la période payée.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
