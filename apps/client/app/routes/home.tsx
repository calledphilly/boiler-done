import { SignedIn } from "~/components/guards/signed-in";
import type { Route } from "./+types/home";
import { Navigate } from "react-router";
import { SignedOut } from "~/components/guards/signed-out";

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
        <Navigate to='/dashboard' />
      </SignedIn>
      <SignedOut>
        <Navigate to='/sign-in' />
      </SignedOut>
    </div>
  )
}
