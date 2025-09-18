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
import { requestPasswordReset, sendVerificationEmail, signIn } from "~/utils/auth"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"

const formSchema = z.object({
    email: z.email()
})

export function ForgotPassword({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const location = useLocation()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: location.state && typeof location.state === "object" && "email" in location.state ? location.state.email : "",
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await requestPasswordReset({
                ...values,
                redirectTo: `${window.location.origin}/reset-password`
            }, {
                onSuccess: () => {
                    toast.success('If an account with that email exists, a password reset link has been sent.');
                }
            });
        } catch (e) {
            toast.error('An error occured during sign up.');
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Forgot password ?</CardTitle>
                    <CardDescription>
                        Enter your email to receive a password reset link
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    <div className="grid gap-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-3">
                                            <FormLabel htmlFor="email">Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="example@domain.org" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full">
                                    Request password reset
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

