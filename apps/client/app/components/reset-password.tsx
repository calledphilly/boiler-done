import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { requestPasswordReset, resetPassword, sendVerificationEmail, signIn } from "~/utils/auth"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { useMemo } from "react"

const formSchema = z.object({
    newPassword: z.string().min(6).max(100)
})

export function ResetPassword({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [params] = useSearchParams()
    const navigate = useNavigate()

    const token = useMemo(() => params.get('token'), [params])

    if (!token) {
        return (
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card className="text-center">
                    <CardHeader>
                        <CardTitle className="text-xl">Invalid token</CardTitle>
                        <CardDescription>
                            The password reset token is missing or invalid. Please request a new password reset link.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>

                        <div className="grid gap-6">
                            <div className="text-center text-sm">
                                <Button asChild>
                                    <Link to="/sign-in">
                                        Back to sign in
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await resetPassword({
                ...values,
                token
            }, {
                onSuccess: () => {
                    toast.success('Your password has been reset successfully.');
                    navigate('/sign-in');
                }
            });
        } catch (e) {
            toast.error('An error occured during password reset.');
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Reset password</CardTitle>
                    <CardDescription>
                        Enter your new password
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    <div className="grid gap-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-3">
                                            <FormLabel htmlFor="newPassword">New password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="New password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full">
                                    Reset password
                                </Button>
                            </form>
                        </Form>

                        <div className="text-center text-sm">
                            <Link to="/sign-in" className="underline underline-offset-4">
                                Back to sign in
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}

