import type { Route } from '../+types/home';

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'Sign In' },
		{ name: 'description', content: 'Welcome to React Router!' },
	];
}

export default function SignIn() {
	return <div>signin</div>;
}
