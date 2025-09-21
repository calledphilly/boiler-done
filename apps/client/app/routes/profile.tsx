import { Profile } from '~/components/profile';
import type { Route } from './+types/home';
import { useSession } from '~/utils/auth';

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'Profile' },
		{ name: 'description', content: 'Welcome to React Router!' },
	];
}

export default function ProfilePage() {
  const {isPending } = useSession()
	return (
		<div className='flex min-h-svh flex-col items-center justify-center'>
			{ !isPending && <Profile />}
		</div>
	);
}
