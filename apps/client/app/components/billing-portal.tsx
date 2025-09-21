import { useCallback, type PropsWithChildren } from "react";
import { Button } from "~/components/ui/button";
import { subscription } from "~/utils/auth";

interface Props extends PropsWithChildren {
    returnPath: string;
}

const BillingPortal = ({ returnPath = '/dashboard', children }: Props) => {


    const openBillingPortal = useCallback(async () => {
        await subscription.billingPortal({
            returnUrl: `${window.location.origin}${returnPath}`,

        });
    }, [returnPath]);

    return (
        <Button onClick={openBillingPortal} variant={"default"}>
            {children || "Manage Subscription"}
        </Button>
    )
}

export default BillingPortal;