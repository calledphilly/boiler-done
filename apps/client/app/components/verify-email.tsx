import { cn } from "~/lib/utils"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
    CardContent,
} from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Link, useLocation } from "react-router"
import { useMemo } from "react"
import { sendVerificationEmail, useSession } from "~/utils/auth"

export function VerifyEmail({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { data: session, isPending } = useSession()
    const location = useLocation()

    const email = useMemo<string | undefined>(() => {
        if (location.state && typeof location.state === "object" && "email" in location.state) {
            return location.state.email
        }
    }, [location.state])

    if (isPending) return null

    if (session && session.user.emailVerified) {
        return (
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card className="text-center">
                    <CardHeader>
                        <CardTitle className="text-xl">Email verified</CardTitle>
                        <CardDescription>
                            Your email has been successfully verified. You can now start using your account.
                        </CardDescription>
                    </CardHeader>

                    <CardFooter>
                        <Button asChild className="mx-auto mb-6">
                            <Link to="/">Go to dashboard</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }



    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="text-center">
                <CardHeader>
                    <CardTitle className="text-xl">Check your inbox</CardTitle>
                    <CardDescription>
                        We’ve sent a verification link to <b>{email || "your email"}</b>.
                        Please click the link to activate your account.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild className="mx-auto mb-6">
                        <Link to="/sign-up">Back to sign up</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div >
    )
}
