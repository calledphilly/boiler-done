import type { PropsWithChildren } from 'react';
import { authClient } from '~/lib/auth-client';

const { useSession } = authClient;

type Props = PropsWithChildren & {};
const SignedIn: React.FC<Props> = ({ children }) => {
	const { data: session } = useSession();
	return session ? children : null;
};

export default SignedIn;
