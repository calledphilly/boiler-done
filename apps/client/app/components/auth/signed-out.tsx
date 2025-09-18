// src/components/auth/SignedIn.tsx
import { type PropsWithChildren } from "react";
import { useSession } from "~/utils/auth";

interface Props extends PropsWithChildren { }

export const SignedOut = ({ children }: Props) => {
    const { data: session, isPending } = useSession();

    return !isPending && !session ? children : null;
};
