import { SignedIn } from "~/components/auth/signed-in";
import type { Route } from "./+types/home";
import { Link } from "react-router";
import SignOut from "~/components/sign-out";
import { Button } from "~/components/ui/button";
import { SignedOut } from "~/components/auth/signed-out";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className='flex min-h-svh flex-col items-center justify-center'>
      <SignedIn>
        <SignOut />
        <Button>Dashboard</Button>
      </SignedIn>
      <SignedOut>
        <Button asChild>
          <Link to={'/sign-in'}>Sign In</Link>
        </Button>
      </SignedOut>
    </div>
  )
}
