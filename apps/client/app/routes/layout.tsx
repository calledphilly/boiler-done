import { Outlet, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { signOut } from "~/utils/auth";
import BillingPortal from "~/components/billing-portal";
import { LogOut, CreditCard, LayoutDashboard, Layers } from "lucide-react";

export default function AppLayout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => navigate("/sign-in"),
                },
            });
        } catch (err) {
            console.error("Erreur logout:", err);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Navbar */}
            <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
                <h1
                    className="text-xl font-semibold text-gray-900 cursor-pointer"
                    onClick={() => navigate("/dashboard")}
                >
                    Mon App
                </h1>

                <nav className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                        onClick={() => navigate("/dashboard")}
                    >
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Button>
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                        onClick={() => navigate("/plans")}
                    >
                        <Layers className="h-4 w-4" /> Plans
                    </Button>
                    <BillingPortal returnPath="/dashboard">
                        <CreditCard className="h-4 w-4" /> Facturation
                    </BillingPortal>
                    <Button
                        variant="destructive"
                        className="flex items-center gap-2"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" /> Déconnexion
                    </Button>
                </nav>
            </header>

            {/* Contenu scrollable */}
            <main className="flex-1 overflow-y-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
}
