// src/components/auth/Protected.tsx
import { useEffect, type PropsWithChildren } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSession } from "~/utils/auth";

interface Props extends PropsWithChildren {
    fallbackPath?: string;
}

export const Protected = ({ children, fallbackPath = "/sign-in" }: Props) => {
    const { data: session, isPending, error } = useSession();

    const navigate = useNavigate();
    const location = useLocation()

    if (isPending) {
        return <div>Loading...</div>;
    }

    useEffect(() => {
        if (!isPending && (!session || error)) {
            navigate(fallbackPath || "/sign-in", { state: { from: location.pathname } });
        }

    }, [session, isPending, error, fallbackPath, location.pathname])

    return children;
};
