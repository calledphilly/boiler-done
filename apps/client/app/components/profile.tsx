import { cn } from "~/lib/utils";

export function Profile({
    className,
    ...props
}: React.ComponentProps<"div">) {

    return (
        <div className={cn(className)} {...props}>
            Profile
        </div>
    )
}