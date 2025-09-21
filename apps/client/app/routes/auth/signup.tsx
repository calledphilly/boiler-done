import type { Route } from '../+types/home';

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'Sign Up' },
		{ name: 'description', content: 'Welcome to React Router!' },
	];
}

export default function SignUp() {
	return <>signup</>;
}
